import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import { runMonitor } from "./monitor-component.js";
import startWebMonitorUI from "./static-web-server.js";

// Logout command
program
	.command("monitor")
	.description("Monitor the performance of your workflows")
	.option("--web", "Open the metrics dashboard in your browser")
	.option("--host <host>", "Remote prometheus host")
	.option("--token <token>", "Remote prometheus token")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "monitor",
			args: options,
			execution: async () => {
				if (options.web) {
					await startWebMonitorUI(options.host || "http://localhost:9090", options.token);
				} else {
					runMonitor(options.host, options.token);
				}
			},
		});
	});
