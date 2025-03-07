import child_process from "node:child_process";
import os from "node:os";
import path from "node:path";
import util from "node:util";
import * as p from "@clack/prompts";
import type { OptionValues } from "commander";
import figlet from "figlet";
import fsExtra from "fs-extra";
import color from "picocolors";
import simpleGit, { type SimpleGit, type SimpleGitOptions } from "simple-git";
import { examples_url, node_file, package_dependencies, package_dev_dependencies } from "./utils/Examples.js";

const exec = util.promisify(child_process.exec);

const HOME_DIR = `${os.homedir()}/.nanoctl`;
const GITHUB_REPO_LOCAL = `${HOME_DIR}/nanoservice-ts`;
const GITHUB_REPO_REMOTE = "https://github.com/deskree-inc/nanoservice-ts.git";

fsExtra.ensureDirSync(HOME_DIR);
const options: Partial<SimpleGitOptions> = {
	baseDir: HOME_DIR,
	binary: "git",
	maxConcurrentProcesses: 6,
	trimmed: false,
};

const git: SimpleGit = simpleGit(options);

export async function createProject(opts: OptionValues, currentPath = false) {
	const isDefault = opts.name !== undefined;
	let projectName: string = opts.name ? opts.name : "";
	let trigger = "http";
	let examples = false;

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
		p.intro(color.inverse(" Create a New Project "));

		// Get the project name and trigger

		const resolveProjectName = async (): Promise<string> => {
			if (projectName !== "") {
				return projectName;
			}

			return (await p.text({
				message: "Please provide a name for the project",
				placeholder: "nano-service",
				defaultValue: "nano-service",
			})) as string;
		};

		const nanoctlProject = await p.group(
			{
				projectName: () => resolveProjectName(),
				trigger: () =>
					p.select({
						message: "Select the trigger to install",
						options: [
							{ label: "HTTP", value: "http", hint: "recommended" },
							//{ label: "GRPC", value: "grpc" }
						],
					}),
				examples: () =>
					p.select({
						message: "Install the examples?",
						options: [
							{ label: "NO", value: false, hint: "recommended" },
							{ label: "YES", value: true },
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

		projectName = nanoctlProject.projectName;
		trigger = nanoctlProject.trigger;
		examples = nanoctlProject.examples;
	}

	const s = p.spinner();
	if (!isDefault) s.start("Creating the project...");

	try {
		// Prepare the project
		const dirPath = !currentPath ? path.join(process.cwd(), projectName) : process.cwd();

		if (!isDefault) s.message("Gathering project files");

		const githubLocalExists = fsExtra.existsSync(GITHUB_REPO_LOCAL);
		if (githubLocalExists) {
			fsExtra.removeSync(GITHUB_REPO_LOCAL);
		}
		await git.clone(GITHUB_REPO_REMOTE, GITHUB_REPO_LOCAL);

		if (!isDefault) s.message("Copying project files...");

		/// Copy the project files
		if (!currentPath) {
			const projectDirExists = fsExtra.existsSync(dirPath);
			if (projectDirExists) {
				throw new Error("A project already exists in the current directory. Please remove it and try again.");
			}
		}

		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/triggers/${trigger}`, dirPath);

		if (!isDefault) {
			s.message("Installing example workflows and nodes");
		}
		const nodesDir = `${dirPath}/src/nodes`;
		const workflowsDir = `${dirPath}/workflows`;

		fsExtra.ensureDirSync(nodesDir);
		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/workflows`, workflowsDir);

		// Examples

		if (!examples) {
			fsExtra.removeSync(`${nodesDir}/examples`);
			fsExtra.removeSync(`${workflowsDir}`);
			fsExtra.ensureDirSync(`${workflowsDir}`);
			fsExtra.ensureDirSync(`${workflowsDir}/json`);
			fsExtra.ensureDirSync(`${workflowsDir}/yaml`);
			fsExtra.ensureDirSync(`${workflowsDir}/toml`);
		} else {
			fsExtra.copySync(`${GITHUB_REPO_LOCAL}/infra/development`, `${nodesDir}/examples/infra`);
			fsExtra.writeFileSync(`${dirPath}/src/Nodes.ts`, node_file);
		}

		// Create .env.local file

		const envExample = `${dirPath}/.env.example`;
		const envLocal = `${dirPath}/.env.local`;

		const envContent = fsExtra.readFileSync(envExample, "utf8");
		const result = envContent.replaceAll("PROJECT_PATH", dirPath);
		fsExtra.writeFileSync(envLocal, result);

		// Change package.json
		const packageJson = `${dirPath}/package.json`;
		const packageJsonContent = JSON.parse(fsExtra.readFileSync(packageJson, "utf8"));
		packageJsonContent.name = projectName;
		packageJsonContent.version = "1.0.0";
		packageJsonContent.author = "";

		if (examples) {
			packageJsonContent.dependencies = {
				...packageJsonContent.dependencies,
				...package_dependencies,
			};
			packageJsonContent.devDependencies = {
				...packageJsonContent.devDependencies,
				...package_dev_dependencies,
			};
		}

		fsExtra.writeFileSync(packageJson, JSON.stringify(packageJsonContent, null, 2));

		// Install Packages
		s.message("Installing packages...");
		await exec("npm install", { cwd: dirPath });

		// Create a new project
		if (!isDefault) s.stop(`Project "${projectName}" created successfully.`);
		console.log(`\nTrigger: ${trigger.toUpperCase()}\n`);
		if (!currentPath) console.log(`Change to the project directory: cd ${projectName}`);
		console.log(`Run the command "npm run dev" to start the development server.`);
		console.log("You can test the project in your browser at http://localhost:4000/health-check");
		console.log("For more documentation, visit https://nanoservice.xyz/");

		if (examples) {
			console.log(examples_url);
		}
	} catch (error) {
		if (!isDefault) s.stop((error as Error).message);
		if (isDefault) console.log((error as Error).message);
	}
}
