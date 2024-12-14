import fs from "node:fs";
import ResolverBase from "./ResolverBase";
import type Config from "./types/Config";

export default class LocalStorage extends ResolverBase {
	async get(name: string): Promise<Config> {
		const rootPath = process.env.WORKFLOWS_PATH;
		const workflowPathJson = `${rootPath}/json/${name}.json`;
		const workflowPathHelper = `${rootPath}/helper/${name}.js`;

		console.log(workflowPathJson, workflowPathHelper);

		const jsonExists = fs.existsSync(workflowPathJson);
		const helperExists = fs.existsSync(workflowPathHelper);

		if (jsonExists)
			return await JSON.parse(fs.readFileSync(workflowPathJson, "utf8"));
		if (helperExists) {
			// @ts-ignore
			return new (await import(workflowPathHelper)).default().getJson();
		}

		throw new Error(`Workflow not found: ${name}`);
	}
}
