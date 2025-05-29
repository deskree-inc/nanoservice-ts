import child_process from "node:child_process";
import * as fs from "node:fs";
import util from "node:util";
import * as p from "@clack/prompts";

import { Command, type OptionValues, trackCommandExecution } from "../../services/commander.js";
import { tokenManager } from "../../services/local-token-manager.js";
import { manager as pm } from "../../services/package-manager.js";
import { VersionUpdateType } from "../../services/package-manager.js";
import { registryManager } from "../../services/registry-manager.js";

const exec = util.promisify(child_process.exec);

const packagePublisherRuntimes = [
	{
		label: "node",
		value: "npm",
	},
	// {
	//     label: "python",
	//     value: "pip"
	// }
];

const packagePublishVerion = [VersionUpdateType.PATCH, VersionUpdateType.MINOR, VersionUpdateType.MAJOR];

export async function publish(opts: OptionValues) {
	const token = tokenManager.getToken();
	const npmrcFile = `${opts.directory}/.npmrc`;
	const logger = p.spinner();
	let packageJsonOriginal: {
		name: string;
		[key: string]: string | boolean | Record<string, string> | string[];
	} | null = null;
	try {
		if (!token) throw new Error("Authentication token not found. Please run 'nanoctl login' before publishing.");
		if (!opts.directory) throw new Error("Directory is required.");

		const runtimesToPublish = await p.select({
			message: "Select node runtime",
			options: packagePublisherRuntimes,
			initialValue: "npm",
		});

		const manager = await pm.getManager(runtimesToPublish as string);

		const versionType = await p.select({
			message: "Select the version bump type",
			options: packagePublishVerion.map((v) => ({ label: v, value: v })),
			initialValue: "patch",
		});

		if (opts.build) {
			logger.start("Running build before publishing...");
			const { stderr: buildError } = await exec(manager.BUILD, { cwd: opts.directory });
			if (buildError) {
				logger.stop(buildError);
				throw new Error(`Error running build: ${buildError}`);
			}
			logger.stop("Build completed successfully.");
		}

		// Update the version in package.json
		logger.message(`Updating package version to ${String(versionType)}...`);
		const { stderr: versionError } = await exec(manager.UPDATE_VERSION({ type: versionType as VersionUpdateType }), {
			cwd: opts.directory,
		});
		if (versionError) {
			logger.stop(versionError);
			throw new Error(`Error updating package version: ${versionError}`);
		}

		logger.start("Publishing node to the nanoservices registry...");

		// Get the registry token
		const registry = await registryManager.getRegistryToken(token);
		if (registry.error) throw new Error("Failed to get registry token.");

		// Create .npmrc file temporarily
		const REGISTRY_URL = `https://${registry.url}`;
		const npmrcContent = `registry=${REGISTRY_URL}\n//${registry.url}:_authToken=${registry.token}`;
		fs.writeFileSync(npmrcFile, npmrcContent);
		p.log.info("Created .npmrc file for authentication.");

		// Update package.json to add scoped registry
		const packageJsonPath = `${opts.directory}/package.json`;
		if (!fs.existsSync(packageJsonPath)) {
			logger.stop("package.json not found in the specified directory.");
			throw new Error("package.json not found in the specified directory.");
		}
		packageJsonOriginal = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		const packageJson = { ...packageJsonOriginal };

		if (!packageJson.name) {
			logger.stop("package.json does not have a name field.");
			throw new Error("package.json does not have a name field.");
		}

		if (packageJson.name.startsWith("@") && !packageJson.name.startsWith(`@${registry.namespace}`)) {
			throw new Error("If you are publishing to the nanoservices registry, the package.json shouldn't be scoped.");
		}
		if (!packageJson.name.startsWith(`@${registry.namespace}`)) {
			packageJson.name = `@${registry.namespace}/${packageJson.name}`;
			packageJson.private = false;
			packageJson.files = ["dist"];
		}

		fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

		// publish the node
		const { stdout } = await exec(manager.PUBLISH({ registry: REGISTRY_URL, npmrcDir: npmrcFile }), {
			cwd: opts.directory,
		});

		const publishResult = JSON.parse(stdout);
		if (publishResult.error) {
			logger.stop(publishResult.error);
			throw new Error(`Error publishing node: ${publishResult.error}`);
		}

		logger.stop(
			`Node published successfully \n Node: ${publishResult.id} \n Version: ${publishResult.version} \n Packed Size: ${publishResult.size} bytes / Unpacked Size: ${publishResult.unpackedSize} bytes \n Amount of files: ${publishResult.entryCount}`,
		);
	} catch (error) {
		if (fs.existsSync(npmrcFile)) fs.unlinkSync(npmrcFile);
		logger.stop((error as Error).message, 1);
	} finally {
		if (fs.existsSync(npmrcFile)) fs.unlinkSync(npmrcFile);
		if (packageJsonOriginal) {
			const packageJsonPath = `${opts.directory}/package.json`;
			fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonOriginal, null, 2));
		}
	}
}

// Login command
export default new Command()
	.command("node")
	.description("Publish a node to the nanoservices registry")
	.option("-d, --directory <value>", "Directory to publish")
	.option("-b, --build", "Run build before publishing")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "publish",
			args: options,
			execution: async () => {
				if (!options.directory) options.directory = process.cwd();
				await publish(options);
			},
		});
	});
