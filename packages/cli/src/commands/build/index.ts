import child_process from "node:child_process";
import crypto from "node:crypto";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

import { BLOK_URL } from "../../services/constants.js";
import { tokenManager } from "../../services/local-token-manager.js";

type StatusType =
	| {
			status?: {
				condition?: {
					reason?: string;
					status?: string;
					message?: string;
				};
				startTime?: string;
				completionTime?: string;
			};
	  }
	| undefined;

const blokJsonModel = {
	name: "",
	builds: [],
	lastBuild: {},
	deployments: [],
	lastDeployment: {},
};

async function initBuild(opts: OptionValues) {
	const initBuild = await fetch(`${BLOK_URL}/build-init`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${opts.token}`,
		},
	});
	if (!initBuild.ok) throw new Error(initBuild.statusText);

	const initBuildData = await initBuild.json();

	return initBuildData;
}

async function exec(command: string, args: string[]) {
	await new Promise<void>((resolve, reject) => {
		const tarProcess = child_process.spawn(command, args);

		tarProcess.on("close", (code) => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Tar process exited with code ${code}`));
			}
		});

		tarProcess.on("error", (err) => {
			reject(err);
		});
	});
}

async function createTarBall(opts: OptionValues) {
	const fileName = `${crypto.randomUUID()}.tar.gz`;
	const args = [
		"-czf",
		`${opts.directory}/${fileName}`,
		"-C",
		opts.directory,
		`--exclude=${fileName}`,
		"--exclude=.blok.json",
		"--exclude=.git",
		"--exclude=node_modules",
		"--exclude=package-lock.json",
		"--exclude=README.md",
		"--exclude=.blokctl/runtimes/python3/python3_runtime/lib",
		".",
	];

	try {
		await exec("tar", args);
	} catch (error) {
		throw new Error(`Failed to create tarball: ${error}`);
	}
	return fileName;
}

async function storeFiles(opts: OptionValues) {
	const file = await fs.readFile(`${opts.directory}/${opts.tarball}`);
	const requestOptions: RequestInit = {
		method: "PUT",
		headers: {
			"Content-Type": "application/x-gzip",
		},
		body: file,
		redirect: "follow",
	};
	const storing = await fetch(opts.url, requestOptions);
	if (!storing.ok) throw new Error("Failed to store file in S3 bucket");
}

async function building(opts: OptionValues) {
	const build = await fetch(`${BLOK_URL}/build/${opts.id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${opts.token}`,
		},
		body: JSON.stringify({
			key: opts.key,
		}),
	});
	if (!build.ok) throw new Error(build.statusText);
	const buildData = await build.json();
	return buildData;
}

async function getBuildStatus(opts: OptionValues) {
	const buildStatus = await fetch(`${BLOK_URL}/build-status/${opts.id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${opts.token}`,
		},
	});
	if (!buildStatus.ok) throw new Error(buildStatus.statusText);
	const buildStatusData = await buildStatus.json();
	return buildStatusData;
}

export async function build(opts: OptionValues) {
	const logger = p.spinner();
	try {
		logger.start(`Building Blok in ${opts.directory}...`);
		// get token
		logger.message("Validating authentication...");
		opts.token = tokenManager.getToken();
		if (!opts.token) throw new Error("No token found. Please login first.");

		// check if the directory is a blok
		const blokFile = `${opts.directory}/.blok.json`;

		// Check if the directory exists
		logger.message("Checking files...");
		if (!fs.existsSync(opts.directory)) throw new Error(`Directory ${opts.directory} does not exist`);
		if (!fs.existsSync(`${opts.directory}/Dockerfile`)) throw new Error(`Dockerfile not found in ${opts.directory}`);
		if (!fs.existsSync(blokFile)) {
			fs.ensureFileSync(blokFile);
			fs.writeJSONSync(blokFile, blokJsonModel, { spaces: 2 });
			logger.message("Creating .blok.json file...");
		}

		logger.message("Loading .blok.json file...");
		const json = fs.readJSONSync(blokFile);

		// Compressing the directory
		logger.message("Creating tarball...");
		opts.tarball = await createTarBall(opts);
		fs.ensureFileSync(opts.tarball);
		logger.message("Tarball created");

		// call init
		logger.message("Initializing build...");
		const init = await initBuild(opts);
		opts.id = init.id;
		opts.url = init.data.url;
		opts.key = init.data.key;
		logger.message("Build initialized");

		// call store
		logger.message("Storing files...");
		await storeFiles(opts);
		fs.removeSync(opts.tarball);
		logger.message("Files stored");

		// call build
		logger.message("Building blok...");
		const build = await building(opts);

		// Check build status
		let status: StatusType;
		do {
			await new Promise((resolve) => setTimeout(resolve, 2000));
			status = await getBuildStatus(opts);
			logger.message(`Build ${status?.status?.condition?.reason}`);
		} while (status?.status?.condition?.status === "Unknown");

		// Store the build result
		logger.message("Storing build result...");
		const initBuildModel = {
			id: opts.id,
			tarball: opts.tarball,
			key: opts.key,
			buildMessage: build.data.message,
			creationTimestamp: build.data.creationTimestamp,
			startTime: status?.status?.startTime,
			completionTime: status?.status?.completionTime,
			reason: status?.status?.condition?.reason,
			status: status?.status?.condition?.status,
			statusMessage: status?.status?.condition?.message,
			updatedAt: new Date().toISOString(),
		};
		json.builds.push(initBuildModel);
		json.lastBuild = initBuildModel;
		fs.writeJSONSync(blokFile, json, { spaces: 2 });

		if (status?.status?.condition?.status !== "True") throw new Error(status?.status?.condition?.message);
		logger.stop("Build completed successfully", 0);
		return true;
	} catch (error) {
		if (opts.tarball && fs.existsSync(opts.tarball)) fs.removeSync(opts.tarball);
		if (opts.id) logger.stop(`Build Failed. ${error} - Build ID: ${opts.id}`, 1);
		else logger.stop(`Build Failed. ${error}`, 1);
		console.error(error);
		return false;
	}
}

const buildCmd = program
	.command("build")
	.option("-d, --directory [value]", "Directory of the blok (defaults to current directory)", process.cwd())
	.description("Build blok")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "build",
			args: options,
			execution: async () => {
				await build(options);
			},
		});
	});

buildCmd
	.command(".")
	.description("Build blok in the current directory")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "build .",
			args: options,
			execution: async () => {
				options.directory = process.cwd();
				await build(options);
			},
		});
	});
