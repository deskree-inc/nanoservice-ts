import { type ChildProcess, spawn } from "node:child_process";
import type { OptionValues } from "commander";

const runningProcesses: ChildProcess[] = [];

export async function devProject(opts: OptionValues) {
	const currentPath = process.cwd();
	console.log("Starting the development server...");
	console.log("Current path: ", currentPath);

	const processes = [
		{ cmd: "npx", args: ["nodemon@3.1.9"], name: "NodeJS Runner" },
		{
			cmd: "npx",
			args: [
				"nodemon@3.1.9",
				"--config",
				"./.nanoctl/runtimes/python3/nodemon.json",
				"--exec",
				"opentelemetry-instrument ./.nanoctl/runtimes/python3/python3_runtime/bin/python3",
				"./.nanoctl/runtimes/python3/server.py",
			],
			name: "Python3 Runner",
		},
	];

	for (const { cmd, args, name } of processes) {
		const child = spawn(cmd, args, { stdio: "inherit" });

		console.log(`✅ ${name} started (PID: ${child.pid})`);

		runningProcesses.push(child);

		child.on("exit", (code) => {
			console.log(`❌ ${name} exited with code ${code}`);
		});

		child.on("error", (err) => {
			console.error(`❌ ${name} error: ${err}`);
		});
	}

	// Capture CTRL+C to stop the processes
	process.on("SIGINT", () => {
		console.log("\n🛑 Stopping processes...");
		for (const child of runningProcesses) {
			try {
				process.kill(child.pid as number, "SIGTERM");
				console.log(`✅ Process ${child.pid} stopped.`);
			} catch (err: unknown) {
				console.error(`⚠️ Error stopping process ${child.pid}: ${(err as Error).message}`);
			}
		}
		process.exit(0);
	});
}
