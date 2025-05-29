import { NANOSERVICE_URL } from "./constants.js";

export default class RegistryManager {
	private registry: string;

	constructor() {
		this.registry = "https://registry.npmjs.org/";
	}

	setRegistry(url: string) {
		this.registry = url;
	}

	getRegistry() {
		return this.registry;
	}

	async getRegistryToken(accessToken: string) {
		const response = await fetch(`${NANOSERVICE_URL}/repository-token`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();
		return data;
	}
}

const registryManager = new RegistryManager();
export { registryManager };
