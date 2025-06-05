import * as fs from "node:fs";
import path from "node:path";
import * as p from "@clack/prompts";

import { Command, type OptionValues, trackCommandExecution } from "../../services/commander.js";
import { NANOSERVICE_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

async function searchWorkflow(opts: OptionValues) {
	const response = await fetch(`${NANOSERVICE_URL}/published-workflow-by-id/${opts.workflow}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${opts.token}`,
		},
	});
	if (!response.ok) throw new Error(response.statusText);

	const searchs = await response.json();

	return searchs.documents;
}

export async function install(opts: OptionValues) {
	const token = tokenManager.getToken();
	const logger = p.spinner();
	try {
		if (!token) throw new Error("Token is invalid.");
		if (!opts.workflow) throw new Error("Workflow name is required.");

		opts.token = token;

		const workflowInfo = await searchWorkflow(opts);

		if (workflowInfo.length === 0) {
			throw new Error("No workflow found.");
		}

		const workflow = workflowInfo[0].workflow;

		logger.start("Installing workflow...");
		// Create workflows directory if it doesn't exist
		const workflowsDir = path.join(opts.directory, "workflows/json");
		if (!fs.existsSync(workflowsDir)) {
			fs.mkdirSync(workflowsDir, { recursive: true });
		}

		// Write workflow JSON file
		const workflowPath = path.join(workflowsDir, `${opts.workflow}.json`);
		fs.writeFileSync(workflowPath, JSON.stringify(workflow, null, 2));

		logger.stop("Workflow installed successfully.");
	} catch (error) {
		logger.stop((error as Error).message, 1);
	}
}

// Login command
export default new Command()
	.command("workflow")
	.description("Install a workflow")
	.option("-d, --directory <value>", "Directory to publish")
	.argument("<workflow>", "Workflow name")
	.action(async (workflow: string, options: OptionValues) => {
		await trackCommandExecution({
			command: "install",
			args: options,
			execution: async () => {
				options.workflow = workflow;
				if (!options.directory) options.directory = process.cwd();
				await install(options);
			},
		});
	});
