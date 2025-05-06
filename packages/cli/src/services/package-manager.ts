import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";

const executor = promisify(_exec);

const PACKAGE_MANAGERS = ["pnpm", "yarn", "npm"]; // Priority order

const isWindows = process.platform === "win32";

type PackageManagerType = {
	[key: string]: {
		INSTALL: string;
		BUILD: string;
	};
};
const COMMANDS: PackageManagerType = {
	pnpm: {
		INSTALL: "pnpm install",
		BUILD: "pnpm run build",
	},
	yarn: {
		INSTALL: "yarn install",
		BUILD: "yarn run build",
	},
	npm: {
		INSTALL: "npm install",
		BUILD: "npm run build",
	},
};

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
			console.log(`Using package manager: ${cmd}`);
			return true;
		} catch {
			return false;
		}
	}

	public async getManager(): Promise<PackageManagerType[string]> {
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
