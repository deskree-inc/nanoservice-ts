import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";

const executor = promisify(_exec);

const isWindows = process.platform === "win32";

export enum VersionUpdateType {
	PATCH = "patch",
	MINOR = "minor",
	MAJOR = "major",
}

type PackageManagerType = {
	[key: string]: {
		INSTALL: string;
		BUILD: string;
		PUBLISH: (opts: { registry: string; npmrcDir: string }) => string;
		INSTALL_NODE: (opts: { node: string; registry: string; npmrcDir: string }) => string;
		UPDATE_VERSION: (opts: { type: VersionUpdateType }) => string;
	};
};

const COMMANDS: PackageManagerType = {
	bun: {
		INSTALL: "bun install",
		BUILD: "bun run build",
		PUBLISH: () => {
			return "bun publish --access public";
		},
		INSTALL_NODE: (opts) => {
			return `bun add ${opts.node}`;
		},
		UPDATE_VERSION: (opts) => {
			return `bun version ${opts.type}`;
		},
	},
	pnpm: {
		INSTALL: "pnpm install",
		BUILD: "pnpm run build",
		PUBLISH: () => {
			return "pnpm publish --access public";
		},
		INSTALL_NODE: (opts) => {
			return `pnpm install ${opts.node}`;
		},
		UPDATE_VERSION: (opts) => {
			return `pnpm version ${opts.type}`;
		},
	},
	yarn: {
		INSTALL: "yarn install",
		BUILD: "yarn run build",
		PUBLISH: () => {
			return "yarn publish --access public";
		},
		INSTALL_NODE: (opts) => {
			return `yarn add ${opts.node}`;
		},
		UPDATE_VERSION: (opts) => {
			return `yarn version --${opts.type}`;
		},
	},
	npm: {
		INSTALL: "npm install",
		BUILD: "npm run build",
		PUBLISH: (opts) => {
			return `npm publish --registry=${opts.registry} --userconfig ${opts.npmrcDir} --json`;
		},
		INSTALL_NODE: (opts) => {
			return `npm install ${opts.node}`;
		},
		UPDATE_VERSION: (opts) => {
			return `npm version ${opts.type}`;
		},
	},
};
const PACKAGE_MANAGERS = Object.keys(COMMANDS);

class PackageManager {
	private static instance: PackageManager;
	private detectedManager: string | null = null;

	private constructor() {}

	public static getInstance(): PackageManager {
		if (!PackageManager.instance) {
			PackageManager.instance = new PackageManager();
		}
		return PackageManager.instance;
	}

	private async isAvailable(cmd: string): Promise<boolean> {
		const checkCmd = isWindows ? `where ${cmd}` : `which ${cmd}`;
		try {
			await executor(checkCmd);
			return true;
		} catch {
			return false;
		}
	}

	public async getAvailableManagers(): Promise<string[]> {
		const availableManagers: string[] = [];
		for (const manager of PACKAGE_MANAGERS) {
			if (await this.isAvailable(manager)) {
				availableManagers.push(manager);
			}
		}
		return availableManagers;
	}

	public async getManager(preferedManager?: string): Promise<PackageManagerType[string]> {
		if (preferedManager) return COMMANDS[preferedManager];
		if (this.detectedManager) return COMMANDS[this.detectedManager];

		for (const manager of PACKAGE_MANAGERS) {
			if (await this.isAvailable(manager)) {
				this.detectedManager = manager;
				return COMMANDS[manager];
			}
		}

		throw new Error("No supported package manager found.");
	}
}

export default PackageManager;

const manager = PackageManager.getInstance();

export { manager };
