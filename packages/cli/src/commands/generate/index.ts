import * as p from "@clack/prompts";
import { Command } from "commander";
import figlet from "figlet";
import open from "open";
import color from "picocolors";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import NodeFileWriter from "./NodeFileWriter.js";
import NodeGenerator from "./NodeGenerator.js";
import RegisterNode from "./RegisterNode.js";

// Generate command for AI vibe coding

const create = new Command("generate").description("Generate code snippets using AI");

create
	.command("ai-node")
	.description("Generate a Node.js code snippet using AI")
	.option("-n, --name <value>", "Name of the Node code snippet")
	.option("-p, --prompt <value>", "Prompt for AI code generation")
	.option("-t, --type <value>", "Type of code snippet (default: 'class')")
	.option("-l, --language <value>", "Programming language for the code snippet (default: 'typescript')")
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
					figlet.textSync("nanoservice-ts CLI".toUpperCase(), {
						font: "Digital",
						horizontalLayout: "default",
						verticalLayout: "default",
						width: 100,
						whitespaceBreak: true,
					}),
				);
				console.log("");

				if (!options.name || !options.prompt) {
					console.error("Both --name and --prompt options are required.");
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
				s.start("Generating Node code snippet...");

				const generator = new NodeGenerator();
				const node = await generator.generateNode(
					options.name.toLowerCase().replace(/\s+/g, "-"),
					options.prompt,
					options.apiKey || process.env.OPENAI_API_KEY,
				);
				const cleaned = node.code.replace(/^```typescript\s*([\s\S]*?)\s*```$/gm, "$1");
				const nodeType = options.type || "class";
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
				await open(filePath, { app: { name: "Visual Studio Code" }, wait: false });
				await open(nodesFilePath, { app: { name: "Visual Studio Code" }, wait: false });

				s.stop(`Node code snippet "${node.nodeName}" generated and registered successfully!`);
			},
		});
	});

program.addCommand(create);
