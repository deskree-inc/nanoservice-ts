import * as fs from "node:fs";
import * as path from "node:path";
import * as p from "@clack/prompts";

import { Command, type OptionValues, trackCommandExecution } from "../../services/commander.js";
import { NANOSERVICE_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

interface WorkflowSchema {
	id: string;
	content: {
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
	};
}

function findSimilarFiles(directory: string, searchTerm: string): string[] {
	const files = fs.readdirSync(directory);
	return files
		.filter((file) => file.endsWith(".json"))
		.filter((file) => {
			const fileName = file.toLowerCase().replace(".json", "");
			const search = searchTerm.toLowerCase();

			// Exact match gets highest priority
			if (fileName === search) return true;

			// Check if search term is a substring at the start
			if (fileName.startsWith(search)) return true;

			// Check if words in the filename start with the search term
			const words = fileName.split(/[-_]/);
			if (words.some((word) => word.startsWith(search))) return true;

			// If search term is 3 or more chars, allow for partial matches
			if (search.length >= 3) {
				// Calculate similarity (more than 50% of chars match in sequence)
				let matches = 0;
				let searchIndex = 0;

				for (let i = 0; i < fileName.length && searchIndex < search.length; i++) {
					if (fileName[i] === search[searchIndex]) {
						matches++;
						searchIndex++;
					}
				}

				return matches >= search.length * 0.5;
			}

			return false;
		});
}

async function loadWorkflowFiles(directory: string): Promise<{ label: string; value: WorkflowSchema }[]> {
	const workflowsDir = path.join(directory, "workflows/json");
	if (!fs.existsSync(workflowsDir)) {
		throw new Error("workflows/json directory not found");
	}

	const files = fs.readdirSync(workflowsDir);
	return files
		.filter((file) => file.endsWith(".json"))
		.map((file) => {
			const content = JSON.parse(fs.readFileSync(path.join(workflowsDir, file), "utf-8"));
			return {
				label: file.replace(".json", ""),
				value: {
					id: file.replace(".json", ""),
					content: content,
				},
			};
		});
}

async function publishWorkflow(token: string, workflow: Record<string, unknown>, name: string) {
	const response = await fetch(`${NANOSERVICE_URL}/publish-workflow`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			workflow: workflow,
			id: name,
		}),
	});
	if (!response.ok) throw new Error(response.statusText);

	const responseJson = await response.json();

	return responseJson;
}

export async function publish(opts: OptionValues) {
	const token = tokenManager.getToken();
	const logger = p.spinner();
	try {
		if (!token) throw new Error("Authentication token not found. Please run 'nanoctl login' before publishing.");
		if (!opts.directory) throw new Error("Directory is required.");

		logger.start("Loading workflows...");
		const workflowsDir = path.join(opts.directory, "workflows/json");

		if (!fs.existsSync(workflowsDir)) {
			throw new Error("workflows/json directory not found");
		}

		let workflow: Record<string, unknown>;
		let workflowId = "";

		if (opts.workflow) {
			const workflowPath = path.join(workflowsDir, `${opts.workflow}.json`);
			if (!fs.existsSync(workflowPath)) {
				// Search for similar files
				const similarFiles = findSimilarFiles(workflowsDir, opts.workflow);
				if (similarFiles.length > 0) {
					logger.stop("Similar workflows found");
					const selection = await p.select({
						message: "Select a workflow to publish",
						options: similarFiles.map((file) => ({
							label: file.replace(".json", ""),
							value: {
								id: file.replace(".json", ""),
								content: JSON.parse(fs.readFileSync(path.join(workflowsDir, file), "utf-8")),
							},
						})),
					});

					if (p.isCancel(selection)) {
						throw new Error("Operation cancelled");
					}

					workflow = selection.content;
					workflowId = selection.id;
				} else {
					throw new Error(`Workflow with ID "${opts.workflow}" not found and no similar workflows found`);
				}
			} else {
				workflow = JSON.parse(fs.readFileSync(workflowPath, "utf-8"));
				workflowId = opts.workflow;
			}
		} else {
			// List all workflows
			logger.stop("Select a workflow to publish");
			const workflowOptions = await loadWorkflowFiles(opts.directory);

			if (workflowOptions.length === 0) {
				throw new Error("No workflows found in workflows/json directory");
			}

			const selection = await p.select({
				message: "Select a workflow to publish",
				options: workflowOptions,
			});

			if (p.isCancel(selection)) {
				throw new Error("Operation cancelled");
			}

			workflow = selection.content;
			workflowId = selection.id;
		}

		logger.start("Publishing workflow...");
		const name = opts.name || workflowId;
		await publishWorkflow(token, workflow, name);

		logger.stop("Workflow published successfully");
	} catch (error) {
		logger.stop((error as Error).message, 1);
	}
}

// Login command
export default new Command()
	.command("workflow")
	.description("Publish a workflow")
	.option("-d, --directory <value>", "Directory to publish")
	.argument("<workflow>", "Workflow name")
	.action(async (workflow: string, options: OptionValues) => {
		await trackCommandExecution({
			command: "publish workflow",
			args: options,
			execution: async () => {
				options.workflow = workflow;
				if (!options.directory) options.directory = process.cwd();
				await publish(options);
			},
		});
	});
