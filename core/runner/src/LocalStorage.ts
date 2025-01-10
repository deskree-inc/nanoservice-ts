import fs from "node:fs";
import ResolverBase from "./ResolverBase";
import type Config from "./types/Config";
import type { WorkflowLocator } from "./types/GlobalOptions";

export default class LocalStorage extends ResolverBase {
	async get(name: string, workflowLocator: WorkflowLocator): Promise<Config> {
		const rootPath = process.env.VITE_WORKFLOWS_PATH || process.env.WORKFLOWS_PATH;
		const workflowPathJson = `${rootPath}/json/${name}.json`;

		const jsonExists = fs.existsSync(workflowPathJson);
		if (jsonExists) return await JSON.parse(fs.readFileSync(workflowPathJson, "utf8"));

		if (workflowLocator !== undefined) {
			const helperExists = workflowLocator[name] !== undefined;
			if (helperExists) {
				const json = JSON.parse(workflowLocator[name].toJson());
				return json as Config;
			}
		}

		throw new Error(`Workflow not found: ${name}`);
	}
}
