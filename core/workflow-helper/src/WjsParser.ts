import * as fs from "node:fs";

type Trigger = {
	type: string;
	[key: string]: string | undefined;
};

type Step = {
	name?: string;
	node: string;
	type: string;
};

type Node = {
	inputs: Record<string, unknown>;
	[key: string]: unknown;
};

type Workflow = {
	name: string;
	description?: string;
	version: string;
	trigger: Record<string, Trigger>;
	steps: Step[];
	nodes: Record<string, Node>;
};

function readWjsFile(filePath: string): string {
	const content = fs.readFileSync(filePath, "utf8");
	return content.replace(/^\s*[\r\n]/gm, "");
}

function parseWjsContent(wjsContent: string): Workflow {
	// read line by line
	const lines = wjsContent.split("\n");
	const workflow: Workflow = <Workflow>{};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		// Identify the workflow name:
		// set name = "World Countries";
		// Accepts only double quotes or single quotes, also the line must end with a semicolon
		// Also, the line must start with set name
		if (line.match(/^set name =\s*"([^"]+)";$/)) {
			const name = line.split("=")[1].trim().replace(/["']/g, "");
			workflow.name = name.substring(0, name.length - 1);
		}

		// Identify the workflow description:
		// set description = "Workflow description";
		// Accepts only double quotes or single quotes, also the line must end with a semicolon
		// Also, the line must start with set description
		// Also the description is optional
		// If not found, the description will be undefined
		// The value of the description is the value between the quotes
		// Remove the semicolon and trim the value
		if (line.match(/^set description =\s*"([^"]+)";$/)) {
			const description = line.split("=")[1].trim().replace(/["']/g, "");
			workflow.description = description.substring(0, description.length - 1);
		}

		// Identify the workflow version:
		// set version = "1.0.0";
		// Accepts only double quotes or single quotes, also the line must end with a semicolon
		// Also, the line must start with set version
		if (line.match(/^set version =\s*"([^"]+)";$/)) {
			const version = line.split("=")[1].trim().replace(/["']/g, "");
			workflow.version = version.substring(0, version.length - 1);
		}

		// Identify the workflow trigger:
		// setTrigger<http> {
		//   set method = "GET";
		//   set path = "/";
		//   set accept = "application/json";
		// }
		// The trigger type is the text between the angle brackets
		// The trigger type is case sensitive
		// The trigger type must be followed by an opening curly brace
		// The trigger type must be followed by a closing curly brace
		// Expected result
		// "trigger": {
		//         "http": {
		//             "method": "GET",
		//             "path": "/",
		//             "accept": "application/json"
		//         }
		//     }
		if (line.match(/^setTrigger<.*> {$/)) {
			const triggerType = line.split("<")[1].split(">")[0];
			const trigger: Trigger = { type: triggerType };
			for (let j = i + 1; j < lines.length; j++) {
				const triggerLine = lines[j];
				if (triggerLine.match(/^}$/)) {
					i = j;
					break;
				}
				const key = triggerLine.split("=")[0].trim().replace("set", "").trim();
				const value = triggerLine.split("=")[1].trim().replace(/["']/g, "");
				if (key !== "type") {
					trigger[key] = value.substring(0, value.length - 1);
				}
			}
			workflow.trigger = { [triggerType]: trigger };
		}

		// Identify the workflow steps, example:
		// addStep {
		//   set name = "get-countries-api";
		//   set node = "@nanoservice-ts/api-call";
		//   set type = "module";
		//   set inputs {
		//     set url = "https://countriesnow.space/api/v0.1/countries/capital";
		//     set method = "GET";
		//     set headers {
		//       set "Content-Type" = "application/json";
		//     }
		//     set responseType = "application/json";
		//   }
		// }
		// expected result
		// "steps": [
		//   {
		//     "name": "get-countries-api",
		//     "node": "@nanoservice-ts/api-call",
		//     "type": "module"
		//   }
		// ],
		//   "nodes": {
		//   "get-countries-api": {
		//     "inputs": {
		//       "url": "https://countriesnow.space/api/v0.1/countries/capital",
		//         "method": "GET",
		//           "headers": {
		//         "Content-Type": "application/json"
		//       },
		//       "responseType": "application/json"
		//     }
		//   }
		// }

		if (line.match(/^addStep {$/)) {
			const step: Step = <Step>{};
			const node: Node = <Node>{};
			for (let j = i + 1; j < lines.length; j++) {
				const stepLine = lines[j].trim();
				if (stepLine.match(/^}$/)) {
					i = j;
					break;
				}

				if (stepLine.trim().match(/^set name =\s*"([^"]+)";$/)) {
					const name = stepLine.trim().split("=")[1].trim().replace(/["']/g, "");
					step.name = name.substring(0, name.length - 1);
				}

				if (stepLine.match(/^set node =\s*"([^"]+)";$/)) {
					const nodeValue = stepLine.split("=")[1].trim().replace(/["']/g, "");
					step.node = nodeValue.substring(0, nodeValue.length - 1);
				}

				if (stepLine.match(/^set type =\s*"([^"]+)";$/)) {
					const type = stepLine.split("=")[1].trim().replace(/["']/g, "");
					step.type = type.substring(0, type.length - 1);
				}

				if (stepLine.match(/^set inputs {$/)) {
					for (let k = j + 1; k < lines.length; k++) {
						const inputLine = lines[k].trim();
						console.log("INPUT LINE", inputLine);
						if (inputLine.match(/^}$/)) {
							j = k;
							break;
						}

						if (inputLine.match(/^set\s+(\w+)\s*=\s*["']([^"']+)["'];$/)) {
							const key = inputLine.split("=")[0].trim().replace("set", "").trim();
							const value =
								inputLine
									.split("=")[1]
									.trim()
									.match(/["'](.*)["'];$/)?.[1] || "";
							node.inputs = node.inputs || {};
							node.inputs[key] = value;
						} else {
							console.log("Invalid input line", inputLine);
						}
					}
				}
			}

			workflow.steps = [step];
			if (step.name) {
				workflow.nodes = { [step.name]: node };
			}
		}
	}

	return workflow;
}

// Compile .wjs File to JSON Workflow
function compileWjsToJson(filePath: string): Workflow {
	const wjsContent = readWjsFile(filePath);
	return parseWjsContent(wjsContent);
}

export { compileWjsToJson };
