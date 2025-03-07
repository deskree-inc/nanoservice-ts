import child_process from "node:child_process";
import os from "node:os";
import path from "node:path";
import util from "node:util";
import * as p from "@clack/prompts";
import type { OptionValues } from "commander";
import figlet from "figlet";
import fsExtra from "fs-extra";
import color from "picocolors";

const exec = util.promisify(child_process.exec);

const HOME_DIR = `${os.homedir()}/.nanoctl`;
const GITHUB_REPO_LOCAL = `${HOME_DIR}/nanoservice-ts`;

export async function createNode(opts: OptionValues, currentPath = false) {
	const isDefault = opts.name !== undefined;
	let nodeName: string = opts.name ? opts.name : "";
	let nodeType = "";
	let template = "";

	if (!isDefault) {
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

		const resolveNodeName = async (): Promise<string> => {
			if (nodeName !== "") {
				return nodeName;
			}

			return (await p.text({
				message: "Please provide a name for the node",
				placeholder: "node-name",
				defaultValue: "",
			})) as string;
		};

		p.intro(color.inverse(" Creating a new Node "));
		const nanoctlNode = await p.group(
			{
				nodeName: () => resolveNodeName(),
				nodeType: () =>
					p.select({
						message: "Select the nanoservice type",
						options: [
							{ label: "Module", value: "module", hint: "recommended" },
							{ label: "Class", value: "class" },
						],
					}),
				template: () =>
					p.select({
						message: "Select the template",
						options: [
							{ label: "Class", value: "class", hint: "recommended" },
							{ label: "UI - EJS + ReactJS + TailwindCSS", value: "ui" },
						],
					}),
			},
			{
				onCancel: () => {
					p.cancel("Operation canceled.");
					process.exit(0);
				},
			},
		);

		nodeName = nanoctlNode.nodeName;
		nodeType = nanoctlNode.nodeType;
		template = nanoctlNode.template;
	}

	const s = p.spinner();
	if (!isDefault) s.start("Creating the node...");

	try {
		// Prepare the project
		const mainDirExists = fsExtra.existsSync(GITHUB_REPO_LOCAL);
		if (!mainDirExists)
			throw new Error(
				"The nanoservice-ts repository was not found. Please run 'nanoctl create project' to clone the repository.",
			);

		let dirPath = process.cwd();
		if (!currentPath) {
			// Validate the project
			const currentDir = `${process.cwd()}/src`;
			const nodeProjectDirExists = fsExtra.existsSync(currentDir);
			if (!nodeProjectDirExists) throw new Error("ops1");

			// Prepare the node
			const currentNodesDir = `${currentDir}/nodes`;
			if (!isDefault) {
				fsExtra.ensureDirSync(currentNodesDir);
			} else {
				const nodeDirExists = fsExtra.existsSync(currentNodesDir);
				if (!nodeDirExists) throw new Error("ops1");
			}

			dirPath = path.join(currentNodesDir, nodeName);
		}

		if (!isDefault) s.message("Copying project files...");

		/// Copy the node files
		if (!currentPath) {
			const nodeDirExists = fsExtra.existsSync(dirPath);
			if (nodeDirExists) throw new Error("ops2");
		}

		if (nodeType === "module") {
			if (template === "class") {
				fsExtra.copySync(`${GITHUB_REPO_LOCAL}/templates/node`, dirPath);
			}

			if (template === "ui") {
				fsExtra.copySync(`${GITHUB_REPO_LOCAL}/templates/node-ui`, dirPath);
			}
		}

		if (nodeType === "class") {
			if (template === "class") {
				fsExtra.ensureDirSync(dirPath);
				fsExtra.copyFileSync(`${GITHUB_REPO_LOCAL}/templates/node/index.ts`, `${dirPath}/index.ts`);
			}

			if (template === "ui") {
				fsExtra.ensureDirSync(dirPath);
				fsExtra.ensureDirSync(`${dirPath}/app`);
				fsExtra.copySync(`${GITHUB_REPO_LOCAL}/templates/node-ui/app`, `${dirPath}/app`);
				fsExtra.copyFileSync(`${GITHUB_REPO_LOCAL}/templates/node-ui/index.ts`, `${dirPath}/index.ts`);
				fsExtra.copyFileSync(`${GITHUB_REPO_LOCAL}/templates/node-ui/inputSchema.ts`, `${dirPath}/inputSchema.ts`);
				fsExtra.copyFileSync(`${GITHUB_REPO_LOCAL}/templates/node-ui/index.html`, `${dirPath}/index.html`);
			}
		}

		// Change project name in package.json
		const packageJson = `${dirPath}/package.json`;
		const packageJsonContent = JSON.parse(fsExtra.readFileSync(packageJson, "utf8"));
		packageJsonContent.name = nodeName;
		packageJsonContent.version = "1.0.0";
		packageJsonContent.author = "";
		fsExtra.writeFileSync(packageJson, JSON.stringify(packageJsonContent, null, 2));

		// Install Packages
		if (nodeType === "module") {
			s.message("Installing packages...");
			await exec("npm install", { cwd: dirPath });

			// Build the project
			s.message("Building the project...");
			await exec("npm run build", { cwd: dirPath });
		}

		if (!isDefault) s.stop(`Node "${nodeName}" created successfully.`);
		if (!currentPath) console.log(`\nNavigate to the node directory by running: cd src/nodes/${nodeName}`);
		console.log(
			`${currentPath ? "\n" : ""}Run the command "npm run build" or "npm run build:dev" to build the project.`,
		);
		console.log("For more documentation, visit https://nanoservice.xyz/docs/d/core-concepts/nodes");
	} catch (error) {
		if (!isDefault) s.stop("An error occurred");

		const message = (error as Error).message;
		if (message === "ops1") {
			console.log(
				"Oops! It seems like you haven't created a project yet... or have you? 🤔\n" +
					"If you already did, you can navigate to it using: cd project-name\n" +
					"Otherwise, you can create a new project with: npx nanoctl@latest create project",
			);
		}
		if (message === "ops2") {
			console.log(
				"The node you are trying to create already exists in the project.\n" +
					"Please use a different name, or delete the existing node to create a new one.",
			);
		}
		if (message !== "ops1" && message !== "ops2") {
			console.log((error as Error).message);
		}
	}
}
