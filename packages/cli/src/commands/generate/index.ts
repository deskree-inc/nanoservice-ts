import readline from "node:readline";
import * as p from "@clack/prompts";
import { Command } from "commander";
import figlet from "figlet";
import open from "open";
import color from "picocolors";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import { getPreferredEditor } from "../../services/utils.js";
import NodeFileWriter from "./NodeFileWriter.js";
import NodeGenerator, { type NodeInformation } from "./NodeGenerator.js";
import RegisterNode from "./RegisterNode.js";

// Generate command for AI vibe coding

const create = new Command("generate").description("Generate code snippets using AI");

create
	.command("ai-node")
	.description("Generate a Node.js code snippet using AI")
	.option("-n, --name <value>", "Name of the Node code snippet")
	.option("-p, --prompt <value>", "Prompt for AI code generation")
	.option("-t, --type <value>", "Type of code snippet (default: 'class')")
	.option("-u, --update", "Update existing Node code snippet")
	.option(
		"-k, --api-key <value>",
		"OpenAI API key (optional, uses environment variable OPENAI_API_KEY if not provided)",
	)
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "generate ai-node",
			args: options,
			execution: async () => {
				console.log(
					figlet.textSync("Blok CLI".toUpperCase(), {
						font: "Digital",
						horizontalLayout: "default",
						verticalLayout: "default",
						width: 100,
						whitespaceBreak: true,
					}),
				);
				console.log("");

				if (!options.name) {
					if (!options.update && !options.prompt) {
						console.error("Both --name and --prompt options are required.");
					} else {
						console.error("The --name option is required.");
					}
					process.exit(1);
				}

				if (!options.apiKey && !process.env.OPENAI_API_KEY) {
					console.error(
						"An OpenAI API key is required. Please provide it using --api-key or set the OPENAI_API_KEY environment variable.",
					);
					process.exit(1);
				}

				p.intro(color.inverse(" Create a New Node Code Snippet "));
				const s = p.spinner();

				let node: NodeInformation = <NodeInformation>{};
				let cleaned = "";
				let nodeType = "class";

				if (!options.update) {
					s.start("Generating Node code snippet...");
					// Generate the Node code snippet using AI
					const generator = new NodeGenerator();
					node = await generator.generateNode(
						options.name.toLowerCase().replace(/\s+/g, "-"),
						options.prompt,
						options.apiKey || process.env.OPENAI_API_KEY,
					);
					cleaned = node.code.replace(/^```typescript\s*([\s\S]*?)\s*```$/gm, "$1");
					nodeType = options.type || "class";
				} else {
					const nodeName = options.name.toLowerCase().replace(/\s+/g, "-");
					p.intro(color.inverse(`🛠️  Update Existing Node: ${nodeName}`));

					const rl = readline.createInterface({
						input: process.stdin,
						output: process.stdout,
						terminal: true,
					});

					const lines: string[] = [];
					console.log("\n   Enter your code below:");
					console.log("   - Type 'quit' on a new line to finish");
					console.log("   - Press Ctrl+C to cancel");
					console.log("   ----------------------------------------\n");

					const multilineInput = await new Promise<string>((resolve) => {
						rl.on("line", (input: string) => {
							if (input.trim().toLocaleLowerCase() === "quit") {
								rl.close();
								resolve(lines.join("\n"));
							} else {
								lines.push(input);
								rl.prompt();
							}
						});

						// Handle Ctrl+C to cancel
						rl.on("SIGINT", () => {
							console.log("\nInput cancelled");
							rl.close();
							resolve("");
						});

						// Handle Ctrl+D (EOF)
						rl.on("close", () => {
							if (lines.length > 0) {
								resolve(lines.join("\n"));
							} else {
								resolve("");
							}
						});

						rl.prompt();
					});

					s.start("Updating Node code...");
					// Generate the Node code snippet using AI
					const generator = new NodeGenerator();
					node = await generator.generateNode(
						options.name.toLowerCase().replace(/\s+/g, "-"),
						multilineInput,
						options.apiKey || process.env.OPENAI_API_KEY,
						true,
					);
					cleaned = node.code.replace(/^```typescript\s*([\s\S]*?)\s*```$/gm, "$1");
					nodeType = options.type || "class";
				}

				// Create the file with the generated code snippet
				const filePath = await new NodeFileWriter().generateFile(
					node.nodeName,
					nodeType,
					cleaned,
					options.apiKey || process.env.OPENAI_API_KEY,
				);

				// Register the new node in Nodes.ts
				s.message(`Registering node "${node.nodeName}" in Nodes.ts...`);
				const register = new RegisterNode();
				const nodesFilePath = await register.generateNodesFile(
					node.nodeName,
					`./nodes/${node.nodeName}`,
					node.code,
					options.apiKey || process.env.OPENAI_API_KEY,
				);

				// Open file in the default editor
				const editor = getPreferredEditor();

				await open(filePath, { app: { name: editor }, wait: false });

				if (!options.update) {
					await open(nodesFilePath, { app: { name: editor }, wait: false });
				}

				s.stop(`Node code snippet "${node.nodeName}" generated and registered successfully!`);
			},
		});
	});

program.addCommand(create);
