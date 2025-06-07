import * as p from "@clack/prompts";
import fs from "fs-extra";
import color from "picocolors";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

import { BLOK_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

import { build as buildCommand } from "../build/index.js";

type StatusType = {
	conditions?: Array<{
		type?: string;
		reason?: string;
		message?: string;
		status?: string;
		lastTransitionTime?: string;
	}>;
	latestCreatedRevisionName?: string;
	latestReadyRevisionName?: string;
	observedGeneration?: number;
	traffic?: Array<{
		percent?: number;
		latestRevision?: string;
		revisionName?: string;
	}>;
};

async function getDeploymentStatus(opts: OptionValues): Promise<StatusType> {
	const deploymentStatus = await fetch(`${BLOK_URL}/deploy-status/${opts.name}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${opts.token}`,
		},
	});
	if (!deploymentStatus.ok) throw new Error(deploymentStatus.statusText);
	const deploymentStatusData = await deploymentStatus.json();
	return deploymentStatusData.data;
}

export async function deploy(opts: OptionValues) {
	const logger = p.spinner();
	try {
		logger.start("Deploying blok...");
		// check if the directory is a blok
		const blokFile = `${opts.directory}/.blok.json`;

		// Check if the directory exists
		logger.message("Checking files...");
		if (!fs.existsSync(opts.directory)) throw new Error(`Directory ${opts.directory} does not exist`);
		if (!fs.existsSync(blokFile)) throw new Error(`.blok.json file not found in ${opts.directory}`);

		logger.message("Loading .blok.json file...");
		const json = fs.readJSONSync(blokFile);

		// Validate name with regex, should allow letters and dashes only without numbers
		const nameRegex = /^[a-z](?:[a-z-]*[a-z])?$/;
		if (!nameRegex.test(opts.name))
			throw new Error(`Invalid name ${opts.name}. Name should only contain letters and dashes.`);

		// Validating the blok name
		if (!json.name || json.name === "") {
			json.name = opts.name;
			fs.writeJSONSync(blokFile, json, { spaces: 2 });
			logger.message(`Updated .blok.json name to ${opts.name}`);
		} else {
			if (json.name !== opts.name) {
				logger.message(`.blok.json name is ${json.name}, but you provided ${opts.name}`);
				const confirm = await p.confirm({
					message: `Do you want to update the name in .blok.json to ${opts.name}?`,
					initialValue: false,
				});
				if (!confirm) throw new Error("Aborting deployment");
				json.name = opts.name;
				fs.writeJSONSync(blokFile, json, { spaces: 2 });
				logger.message(`Updated .blok.json name to ${opts.name}`);
			}
		}

		// getting last build id
		if (!json.lastBuild) throw new Error("No last build found. Please build first.");
		if (!json.lastBuild.id) throw new Error("No last build id found. Please build first.");
		if (!json.lastBuild.reason) throw new Error("No last build status found. Please build first.");
		if (json.lastBuild.reason !== "Succeeded") throw new Error("Last build was not successful. Please build again.");
		opts.id = json.lastBuild.id;

		// get token
		logger.message("Validating authentication...");
		opts.token = tokenManager.getToken();
		if (!opts.token) throw new Error("No token found. Please login first.");

		logger.message("Deployment started...");
		const deployment = await fetch(`${BLOK_URL}/deploy/${opts.id}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${opts.token}`,
			},
			body: JSON.stringify({
				serviceName: opts.name,
				access: opts.public ? "public" : "private",
			}),
		});
		if (!deployment.ok) throw new Error(deployment.statusText);
		const deploymentData = await deployment.json();
		if (deploymentData.error) throw new Error(deploymentData.error);

		// Check deployment status
		let isReady = false;
		let deploymentStatus: StatusType = {};
		let errorCount = 0;
		do {
			logger.message("Deploying...");
			await new Promise((resolve) => setTimeout(resolve, 2000));
			deploymentStatus = await getDeploymentStatus(opts);
			isReady = true;
			for (const condition of deploymentStatus?.conditions || []) {
				if (condition.reason?.includes("Failed")) {
					errorCount++;
					if (errorCount > 3) throw new Error(condition.message);
				}
				if (condition.status !== "True") {
					isReady = false;
					break;
				}
			}
		} while (!isReady);

		// Update .blok.json with deployment results
		logger.message("Updating .blok.json with deployment results...");
		deploymentData.data.status = deploymentStatus;
		json.deployments = json.deployments || [];
		json.deployments.push(deploymentData);
		json.lastDeployment = deploymentData;
		fs.writeJSONSync(blokFile, json, { spaces: 2 });

		logger.message("Deployment completed");
		logger.stop(
			`Blok deployed successfully! ${color.gray(`Version: ${deploymentStatus?.latestReadyRevisionName}`)}`,
			0,
		);
		p.log.success(`Service live at: ${color.greenBright(deploymentData?.data?.url)}`);
		p.log.success(`Monitoring live at: ${color.greenBright(deploymentData?.data?.prometheusUrl)}`);
		return true;
	} catch (error) {
		logger.stop(`Error: ${error}`, 1);
		return false;
	}
}

const deployCmd = program
	.command("deploy")
	.description("Deploy blok")
	.requiredOption("-n, --name <name>", "Name of the blok")
	.option("--build", "Build before deploying", () => true)
	.option("--public", "Make the blok public (default: false)", false)
	.option("-d, --directory [value]", "Directory of the blok (defaults to current directory)", process.cwd())
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
	.description("Deploy blok in the current directory")
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
