import * as fs from "node:fs";
import os from "node:os";
import * as path from "node:path";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import fsExtra from "fs-extra";
import generateNodeManifestSystemPrompt from "./prompts/create-node-manifest.system.js";

export default class NodeFileWriter {
	/**
	 * Generates a file with the given content in the specified directory.
	 * If the directory does not exist, it will be created.
	 * If the file already exists, it will be overwritten.
	 *
	 * @param directoryPath - The path of the directory where the file will be created.
	 * @param fileName - The name of the file to be created.
	 * @param fileContent - The content to write into the file.
	 */
	public async generateFile(nodeName: string, nodeType: string, fileContent: string, apiKey: string): Promise<string> {
		try {
			const dirName = nodeName.toLowerCase().replace(/\s+/g, "-");
			const dirPath = process.cwd();
			const nodeDir = `${dirPath}/src/nodes`;
			const HOME_DIR = `${os.homedir()}/.nanoctl`;
			const GITHUB_REPO_LOCAL = `${HOME_DIR}/nanoservice-ts`;

			// Check if the nodes directory exists, if not, create it
			if (!fs.existsSync(nodeDir)) {
				throw new Error("The nodes directory does not exist. Please ensure you are in the correct project directory.");
			}

			const currentDir = `${nodeDir}/${dirName}`;

			// Ensure the directory exists, create it if it doesn't
			if (!fs.existsSync(currentDir)) {
				fs.mkdirSync(currentDir, { recursive: true });
			}

			const filePath = path.join(currentDir, "index.ts");

			// Write the file content, overwriting if it already exists
			if (nodeType === "module") {
				fsExtra.copySync(`${GITHUB_REPO_LOCAL}/templates/node`, currentDir);
				fs.writeFileSync(filePath, fileContent, "utf8");

				const configFileContent = fs.readFileSync(`${currentDir}/config.json`, "utf8");

				// Generate the import statement for the new node using openai
				const openai = createOpenAI({
					compatibility: "strict",
					apiKey: apiKey,
				});

				const { text } = await generateText({
					model: openai("gpt-4o"),
					system: `${generateNodeManifestSystemPrompt.prompt} \n${configFileContent}`,
					prompt: `Node information:

Name: ${nodeName} (This is the key in the nodes object)
Source Code:
${fileContent}

Take the class name from the source code and use it to register the node in Nodes.ts.`,
					temperature: 0.2,
				});

				const cleaned = text.replace(/^```json\s*([\s\S]*?)\s*```$/gm, "$1");
				fs.writeFileSync(`${currentDir}/config.json`, cleaned, "utf8");
			} else {
				fs.writeFileSync(filePath, fileContent, "utf8");
			}

			return filePath;
		} catch (error) {
			console.error(`Error generating file: ${(error as Error).message}`);
			throw error;
		}
	}
}
