// @ts-ignore
import fs from "node:fs";
import { XMLParser } from "fast-xml-parser";
import { parse } from "smol-toml";
import YAML from "yaml";
import ResolverBase from "./ResolverBase";
import type Config from "./types/Config";
import type { WorkflowLocator } from "./types/GlobalOptions";

export default class LocalStorage extends ResolverBase {
	async get(name: string, workflowLocator: WorkflowLocator, fileType?: string): Promise<Config> {
		const rootPath = process.env.VITE_WORKFLOWS_PATH || process.env.WORKFLOWS_PATH;
		let workflowFileType = fileType || process.env.VITE_WORKFLOWS_FILE_TYPE || process.env.WORKFLOWS_FILE_TYPE;
		if (workflowFileType === undefined) workflowFileType = "json";
		const workflowPathJson = `${rootPath}/${workflowFileType}/${name}.${workflowFileType}`;

		const fileExists = fs.existsSync(workflowPathJson);
		if (fileExists) {
			if (workflowFileType === "json") {
				return JSON.parse(fs.readFileSync(workflowPathJson, "utf8"));
			}

			if (workflowFileType === "yaml") {
				const yaml = fs.readFileSync(workflowPathJson, "utf8");
				return YAML.parse(yaml);
			}

			if (workflowFileType === "xml") {
				const xml = fs.readFileSync(workflowPathJson, "utf8");
				const json = new XMLParser({ isArray: (tag: string) => tag === "steps" }).parse(xml);

				return json;
			}

			if (workflowFileType === "toml") {
				const toml = fs.readFileSync(workflowPathJson, "utf8");
				const json = parse(toml);

				return json as unknown as Config;
			}
		}

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
