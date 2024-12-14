import fs from "node:fs";
import ResolverBase from "./ResolverBase";

export default class LocalStorage extends ResolverBase {
	async get(name: string): Promise<string | undefined> {
		const blueprintPath = `workflows/${name}.json`;
		if (!fs.existsSync(blueprintPath)) return undefined;
		return await JSON.parse(fs.readFileSync(blueprintPath, "utf8"));
	}
}
