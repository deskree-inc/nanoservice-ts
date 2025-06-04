import * as p from "@clack/prompts";
import { Command, type OptionValues, trackCommandExecution } from "../../services/commander.js";
import { NANOSERVICE_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

import { install } from "../install/workflow.js";

interface WorkflowSchema {
	name: string;
	version: string;
	description?: string;
	steps?: Array<{
		name: string;
		node: string;
		type: "local" | "module" | "runtime.python3";
		inputs?: Record<string, unknown>;
	}>;
	nodes?: Record<
		string,
		{
			inputs?: Record<string, unknown>;
		}
	>;
	trigger?: {
		[K in "http" | "cron" | "manual" | "grpc"]?: {
			method?: string;
			path?: string;
			accept?: string;
		};
	};
}
interface Workflow {
	_id: string;
	id: string;
	workflow: WorkflowSchema;
}

interface WorkflowOption extends Workflow {
	label: string;
	value: string;
}

async function searchWorkflow(opts: OptionValues) {
	const response = await fetch(`${NANOSERVICE_URL}/published-workflow?workflow_name=${opts.workflow}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${opts.token}`,
		},
	});
	if (!response.ok) throw new Error(response.statusText);

	const searchs = await response.json();

	return searchs.documents;
}

export async function search(opts: OptionValues) {
	const token = tokenManager.getToken();
	const logger = p.spinner();
	try {
		if (!token) throw new Error("Token is required.");
		if (!opts.workflow) throw new Error("Workflow argument is required.");
		opts.token = token;

		logger.start("Searching for workflow...");

		const searchs = await searchWorkflow(opts);

		if (searchs.length === 0) {
			throw new Error("No workflow found.");
		}

		const selectedWorkflow: WorkflowOption | Workflow | symbol = await p.select<WorkflowOption>({
			message: "Select a workflow to install",
			options: searchs.map((data: Workflow) => ({
				label: `${data.id} (${data.workflow.name}:${data.workflow.version} - ${data.workflow.description})`,
				value: data,
			})),
		});

		if (!selectedWorkflow || typeof selectedWorkflow === "symbol") throw new Error("No workflow selected.");
		// Find the full package info from pkgList
		const workflowInfo = searchs.find((workflow: Workflow) => workflow.id === (selectedWorkflow as Workflow).id);
		if (!workflowInfo) throw new Error("Selected workflow not found.");

		logger.stop(`Starting installation of ${workflowInfo.id}...`);
		await trackCommandExecution({
			command: "install",
			args: opts,
			execution: async () => {
				opts.workflow = workflowInfo.id;
				if (!opts.directory) opts.directory = process.cwd();
				await install(opts);
			},
		});
	} catch (error) {
		logger.stop((error as Error).message, 1);
	}
}

export default new Command()
	.command("workflow")
	.description("Search for a workflow")
	.argument("<workflow>", "Workflow hints")
	.action(async (workflow: string, options: OptionValues) => {
		await trackCommandExecution({
			command: "search workflow",
			args: options,
			execution: async () => {
				options.workflow = workflow;
				await search(options);
			},
		});
	});
