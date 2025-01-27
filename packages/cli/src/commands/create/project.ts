import os from "node:os";
import path from "node:path";
import * as p from "@clack/prompts";
import type { OptionValues } from "commander";
import figlet from "figlet";
import fsExtra from "fs-extra";
import color from "picocolors";
import simpleGit, { type SimpleGit, type SimpleGitOptions } from "simple-git";

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

export async function createProject(opts: OptionValues) {
	const isDefault = opts.name !== undefined;
	let projectName: string = opts.name ? opts.name : "";
	let trigger = "http";

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
		p.intro(color.inverse(" Create a new Project "));

		const nanoctlProject = await p.group(
			{
				projectName: () =>
					p.text({
						message: "Assign a name to the project",
						placeholder: "nano-service",
						defaultValue: "nano-service",
					}),
				trigger: () =>
					p.select({
						message: "Choose the trigger to install",
						options: [
							{ label: "HTTP", value: "http", hint: "recommended" },
							//{ label: "CRON", value: "cron" }
						],
					}),
			},
			{
				onCancel: () => {
					p.cancel("Operation cancelled.");
					process.exit(0);
				},
			},
		);

		projectName = nanoctlProject.projectName;
		trigger = nanoctlProject.trigger;
	}

	const s = p.spinner();
	if (!isDefault) s.start("Creating project...");

	try {
		// Prepare the project
		const dirPath = path.join(process.cwd(), projectName);

		if (!isDefault) s.message("Collecting project files");

		const githubLocalExists = fsExtra.existsSync(GITHUB_REPO_LOCAL);
		if (githubLocalExists) {
			fsExtra.removeSync(GITHUB_REPO_LOCAL);
		}
		await git.clone(GITHUB_REPO_REMOTE, GITHUB_REPO_LOCAL);

		if (!isDefault) s.message("Copying project files");

		/// Copy the project files
		const projectDirExists = fsExtra.existsSync(dirPath);
		if (projectDirExists) throw new Error("Project exists in the current directory. Please remove it and try again.");

		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/triggers/${trigger}`, dirPath);

		if (!isDefault) s.message("Installing the examples of workflows and nodes");
		const nodesDir = `${dirPath}/src/nodes`;
		const workflowsDir = `${dirPath}/workflows`;

		fsExtra.ensureDirSync(nodesDir);
		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/workflows`, workflowsDir);

		// Create .env.local file

		const envExample = `${dirPath}/.env.example`;
		const envLocal = `${dirPath}/.env.local`;

		let envContent = fsExtra.readFileSync(envExample, "utf8");
		envContent = envContent.replace(/PROJECT_NAME/g, dirPath);
		fsExtra.writeFileSync(envLocal, envContent);

		// Change project name in package.json
		const packageJson = `${dirPath}/package.json`;
		const packageJsonContent = JSON.parse(fsExtra.readFileSync(packageJson, "utf8"));
		packageJsonContent.name = projectName;
		packageJsonContent.version = "1.0.0";
		packageJsonContent.author = "";
		fsExtra.writeFileSync(packageJson, JSON.stringify(packageJsonContent, null, 2));

		// Create a new project
		if (!isDefault) s.stop("Project created successfully");
		console.log(`Project Name: ${projectName}`);
		console.log(`Trigger: ${trigger}`);
	} catch (error) {
		if (!isDefault) s.stop((error as Error).message);
		if (isDefault) console.log((error as Error).message);
	}
}
