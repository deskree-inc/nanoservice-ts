import * as fs from "node:fs";
import os from "node:os";
import * as path from "node:path";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import fsExtra from "fs-extra";
import color from "picocolors";
import generateNodeManifestSystemPrompt from "./prompts/create-node-manifest.system.js";
import generateReadmeFromBlok from "./prompts/create-readme.system.js";

export default class NodeFileWriter {
	public nodeDependencies: string[] = [
		"assert",
		"async_hooks",
		"buffer",
		"child_process",
		"cluster",
		"console",
		"constants",
		"crypto",
		"dgram",
		"diagnostics_channel",
		"dns",
		"domain",
		"events",
		"fs",
		"fs/promises",
		"http",
		"http2",
		"https",
		"inspector",
		"module",
		"net",
		"os",
		"path",
		"perf_hooks",
		"process",
		"punycode",
		"querystring",
		"readline",
		"repl",
		"stream",
		"stream/consumers",
		"stream/promises",
		"stream/web",
		"string_decoder",
		"sys",
		"timers",
		"timers/promises",
		"tls",
		"trace_events",
		"tty",
		"url",
		"util",
		"v8",
		"vm",
		"wasi",
		"worker_threads",
		"zlib",
	];

	public typesDependencies: string[] = [
		"express",
		"lodash",
		"jest",
		"mocha",
		"chai",
		"sinon",
		"debug",
		"cors",
		"body-parser",
		"cookie-parser",
		"jsonwebtoken",
		"multer",
		"morgan",
		"passport",
		"uuid",
		"pg",
		"mysql",
		"mysql2",
		"mongodb",
		"node-fetch",
		"ws",
		"socket.io",
		"redis",
		"react",
		"react-dom",
		"jquery",
		"next",
		"yargs",
		"commander",
		"dotenv",
		"formidable",
		"glob",
		"jsonwebtoken",
		"validator",
		"connect",
		"request",
		"supertest",
		"node-schedule",
	];

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
			const HOME_DIR = `${os.homedir()}/.blokctl`;
			const GITHUB_REPO_LOCAL = `${HOME_DIR}/blok`;

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
				console.log("\n\nCreating required files for a module-type node.");
				console.log("- index.ts");
				console.log("- config.json");
				console.log("- README.md");
				console.log("- package.json\n");

				fsExtra.copySync(`${GITHUB_REPO_LOCAL}/templates/node`, currentDir);
				fs.writeFileSync(filePath, fileContent, "utf8");

				const configFileContent = fs.readFileSync(`${currentDir}/config.json`, "utf8");

				// Generate the config.json using AI
				const openai = createOpenAI({
					compatibility: "strict",
					apiKey: apiKey,
				});

				const config = await generateText({
					model: openai("gpt-4o"),
					system: `${generateNodeManifestSystemPrompt.prompt} \n${configFileContent}`,
					prompt: `Node information:

Name: ${nodeName} (This is the key in the nodes object)
Source Code:
${fileContent}

Take the class name from the source code and use it to register the node in Nodes.ts.`,
					temperature: 0.2,
				});

				let cleaned = config.text.replace(/^```json\s*([\s\S]*?)\s*```$/gm, "$1");
				fs.writeFileSync(`${currentDir}/config.json`, cleaned, "utf8");

				// Generate README.md using AI
				const readme = await generateText({
					model: openai("gpt-4o"),
					system: `${generateReadmeFromBlok.prompt} \n${configFileContent}`,
					prompt: `Node information:

Name: ${nodeName} (This is the key in the nodes object)
Source Code:
${fileContent}

Take the class name from the source code and use it to register the node in Nodes.ts.`,
					temperature: 0.2,
				});

				cleaned = readme.text.replace(/^```markdown\s*([\s\S]*?)\s*```$/gm, "$1");
				fs.writeFileSync(`${currentDir}/README.md`, cleaned, "utf8");

				// Update package.json name with the node name
				const packageJsonPath = `${currentDir}/package.json`;
				const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
				const packageJson = JSON.parse(packageJsonContent);
				packageJson.name = nodeName;
				packageJson.description = `A Blok node for ${nodeName}`;
				packageJson.version = "1.0.0";

				// Identify and update dependencies required from the source code returned by AI
				let hasDependencies = false;
				const dependencies = fileContent.match(/import\s+.*?\s+from\s+['"](.*?)['"]/g);
				const installedDependencies: {
					name: string;
					version: string;
				}[] = [];
				if (dependencies) {
					const depList = dependencies
						.map((dep) => {
							const match = dep.match(/['"](.*?)['"]/);
							return match ? match[1] : null;
						})
						.filter((dep): dep is string => dep !== null);
					packageJson.dependencies = packageJson.dependencies || {};
					for (const dep of depList) {
						if (!packageJson.dependencies[dep] && !this.nodeDependencies.includes(dep)) {
							packageJson.dependencies[dep] = "latest"; // Set to latest or specify version as needed
							installedDependencies.push({
								name: dep,
								version: "latest", // or specify a version if known
							});
						}

						if (
							this.typesDependencies.includes(dep) &&
							(!packageJson.devDependencies || !packageJson.devDependencies[`@types/${dep}`])
						) {
							packageJson.devDependencies = packageJson.devDependencies || {};
							packageJson.devDependencies[`@types/${dep}`] = "latest"; // Set to latest or specify version as needed
						}
					}
				}

				fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf8");

				// Update the package.json in the dirPath using the installedDependencies array
				if (installedDependencies.length > 0) {
					const packageJsonDirPath = `${dirPath}/package.json`;
					const packageJsonDirContent = fs.readFileSync(packageJsonDirPath, "utf8");
					const packageJsonDir = JSON.parse(packageJsonDirContent);
					console.log("\n");
					for (const dep of installedDependencies) {
						if (!packageJsonDir.dependencies[dep.name] && !this.nodeDependencies.includes(dep.name)) {
							packageJsonDir.dependencies[dep.name] = dep.version;
							console.log(color.blue(`Added dependency "${dep.name}": "${dep.version}".`));
							hasDependencies = true;
						}

						if (
							this.typesDependencies.includes(dep.name) &&
							(!packageJsonDir.devDependencies || !packageJsonDir.devDependencies[`@types/${dep.name}`])
						) {
							packageJsonDir.devDependencies = packageJsonDir.devDependencies || {};
							packageJsonDir.devDependencies[`@types/${dep.name}`] = "latest"; // Set to latest or specify version as needed
							console.log(color.cyan(`Added dev dependency "@types/${dep.name}": "latest".`));
							hasDependencies = true;
						}
					}
					fs.writeFileSync(packageJsonDirPath, JSON.stringify(packageJsonDir, null, 2), "utf8");

					// Recommend to run npm install
					if (hasDependencies) {
						console.log(color.blue("Run `npm install` to install the new dependencies.\n"));
					}
				}
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
