import * as p from "@clack/prompts";
import fs from "fs-extra";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

import { NANOSERVICE_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

import { build as buildCommand } from "../build/index.js";

async function deploy(opts: OptionValues) {
	const logger = p.spinner();
	try {
		logger.start("Deploying nanoservice...");
		// check if the directory is a nanoservice
		const nanoserviceFile = `${opts.directory}/.nanoservice.json`;

		// Check if the directory exists
		logger.message("Checking files...");
		if (!fs.existsSync(opts.directory)) throw new Error(`Directory ${opts.directory} does not exist`);
		if (!fs.existsSync(nanoserviceFile)) throw new Error(`.nanoservice.json file not found in ${opts.directory}`);

		logger.message("Loading .nanoservice.json file...");
		const json = fs.readJSONSync(nanoserviceFile);

		// Validating the nanoservice name
		if (!json.name || json.name === "") {
			json.name = opts.name;
			fs.writeJSONSync(nanoserviceFile, json, { spaces: 2 });
			logger.message(`Updated .nanoservice.json name to ${opts.name}`);
		} else {
			if (json.name !== opts.name) {
				logger.message(`.nanoservice.json name is ${json.name}, but you provided ${opts.name}`);
				const confirm = await p.confirm({
					message: `Do you want to update the name in .nanoservice.json to ${opts.name}?`,
					initialValue: false,
				});
				if (!confirm) throw new Error("Aborting deployment");
				json.name = opts.name;
				fs.writeJSONSync(nanoserviceFile, json, { spaces: 2 });
				logger.message(`Updated .nanoservice.json name to ${opts.name}`);
			}
		}

		// getting last build id
		if (!json.lastBuild) throw new Error("No last build found. Please build first.");
		if (!json.lastBuild.id) throw new Error("No last build id found. Please build first.");
		opts.id = json.lastBuild.id;

		// get token
		logger.message("Validating authentication...");
		opts.token = tokenManager.getToken();
		if (!opts.token) throw new Error("No token found. Please login first.");

		logger.message("Deployment started...");
		const deployment = await fetch(`${NANOSERVICE_URL}/deploy/${opts.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${opts.token}`,
			},
			body: JSON.stringify({
				serviceName: opts.name,
			}),
		});
		if (!deployment.ok) throw new Error(deployment.statusText);
		const deploymentData = await deployment.json();
		if (deploymentData.error) throw new Error(deploymentData.error);

		// Update .nanoservice.json with deployment results
		logger.message("Updating .nanoservice.json with deployment results...");
		json.deployments = json.deployments || [];
		json.deployments.push(deploymentData);
		json.lastDeployment = deploymentData;
		fs.writeJSONSync(nanoserviceFile, json, { spaces: 2 });

		logger.message("Deployment completed");
		logger.stop("Nanoservice deployed successfully!");
	} catch (error) {
		logger.stop(`Error: ${error}`, 1);
	}
}

const deployCmd = program
	.command("deploy")
	.description("Deploy nanoservice")
	.requiredOption("-n, --name <name>", "Name of the nanoservice")
	.option("--build", "Build before deploying", () => true)
	.option("-d, --directory [value]", "Directory of the nanoservice (defaults to current directory)", process.cwd())
	.action(async (options: OptionValues) => {
		if (options.build) {
			await trackCommandExecution({
				command: "deploy --build",
				args: options,
				execution: async () => {
					await buildCommand(options);
				},
			});
		}
		await trackCommandExecution({
			command: "deploy",
			args: options,
			execution: async () => {
				await deploy(options);
			},
		});
	});

deployCmd
	.command(".")
	.description("Deploy nanoservice in the current directory")
	.action(async (options: OptionValues) => {
		if (options.build) {
			await trackCommandExecution({
				command: "deploy . --build",
				args: options,
				execution: async () => {
					await buildCommand(options);
				},
			});
		}
		await trackCommandExecution({
			command: "deploy .",
			args: options,
			execution: async () => {
				options.directory = process.cwd();
				await deploy(options);
			},
		});
	});
