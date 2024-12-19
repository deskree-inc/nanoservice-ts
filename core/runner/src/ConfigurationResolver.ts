import LocalStorage from "./LocalStorage";
import type GlobalOptions from "./types/GlobalOptions";
import type Targets from "./types/Targets";

export default class ConfigurationResolver {
	private targets: Targets = {};
	private globalOptions: GlobalOptions = <GlobalOptions>{};

	constructor(opts: GlobalOptions) {
		this.targets = {
			local: new LocalStorage(),
		};

		this.globalOptions = opts;
	}

	async get(target: string, name: string) {
		return await this.targets[target].get(name, this.globalOptions.workflows);
	}
}
