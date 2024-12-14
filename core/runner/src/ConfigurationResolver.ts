import LocalStorage from "./LocalStorage";
import type Targets from "./types/Targets";

export default class ConfigurationResolver {
	private targets: Targets = {};

	constructor() {
		this.targets = {
			local: new LocalStorage(),
		};
	}

	async get(target: string, name: string) {
		return await this.targets[target].get(name);
	}
}
