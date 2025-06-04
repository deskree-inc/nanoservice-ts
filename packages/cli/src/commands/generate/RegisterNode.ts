import * as fs from "node:fs";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import registerNodeSystemPrompt from "./prompts/register-node.system.js";

export default class RegisterNode {
	async generateNodesFile(nodeName: string, importPath: string, code: string, apiKey: string): Promise<string> {
		const dirPath = process.cwd();
		const nodesFile = `${dirPath}/src/Nodes.ts`;

		if (!fs.existsSync(nodesFile)) {
			throw new Error("The Nodes.ts file does not exist. Please ensure you are in the correct project directory.");
		}

		// Read the existing content of Nodes.ts
		const fileContent = fs.readFileSync(nodesFile, "utf8");

		// Check if the node is already registered
		if (fileContent.includes(`"${nodeName}"`)) {
			console.log(`\nNode "${nodeName}" is already registered in Nodes.ts.`);
		}

		// Generate the import statement for the new node using openai
		const openai = createOpenAI({
			compatibility: "strict",
			apiKey: apiKey,
		});

		const { text } = await generateText({
			model: openai("gpt-4o"),
			system: `${registerNodeSystemPrompt.prompt} \n${fileContent}`,
			prompt: `Node information:

Name: ${nodeName} (This is the key in the nodes object)
Import Path: ${importPath}
Source Code:
${code}

Take the class name from the source code and use it to register the node in Nodes.ts.`,
			temperature: 0.2,
		});

		const cleaned = text.replace(/^```typescript\s*([\s\S]*?)\s*```$/gm, "$1");

		// Rewrite the Nodes.ts file with the new node registration
		fs.writeFileSync(nodesFile, cleaned, "utf8");

		return nodesFile;
	}
}
