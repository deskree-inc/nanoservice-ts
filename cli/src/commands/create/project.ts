import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as p from "@clack/prompts";
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

export async function createProject() {
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
				p.multiselect({
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

	const s = p.spinner();
	s.start("Creating project...");

	const { projectName, trigger } = nanoctlProject;

	try {
		// Prepare the project
		const dirPath = path.join(process.cwd(), projectName);

		s.message("Collecting project files");

		const githubLocalExists = fsExtra.existsSync(GITHUB_REPO_LOCAL);
		if (githubLocalExists) {
			fsExtra.removeSync(GITHUB_REPO_LOCAL);
		}
		await git.clone(GITHUB_REPO_REMOTE, GITHUB_REPO_LOCAL);

		s.message("Copying project files");

		/// Copy the project files
		const projectDirExists = fsExtra.existsSync(dirPath);
		if (projectDirExists) throw new Error("Project exists in the current directory. Please remove it and try again.");

		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/triggers/${trigger}`, dirPath);

		s.message("Installing the examples of workflows and nodes");
		const nodesDir = `${dirPath}/nodes`;
		const workflowsDir = `${dirPath}/workflows`;
		fs.unlinkSync(nodesDir);
		fs.unlinkSync(workflowsDir);
		fsExtra.ensureDirSync(nodesDir);
		fsExtra.copySync(`${GITHUB_REPO_LOCAL}/workflows`, workflowsDir);

		// Create a new project
		s.stop("Project created successfully");
		console.log(`Project Name: ${projectName}`);
		console.log(`Trigger: ${trigger}`);
	} catch (error) {
		s.stop((error as Error).message);
	}
}
