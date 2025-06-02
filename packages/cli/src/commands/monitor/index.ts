import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import { tokenManager } from "../../services/local-token-manager.js";
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
				let token: string | null | undefined = tokenManager.getToken();
				if (!token) {
					token = options.token as string | undefined;
				}

				if (options.web) {
					await startWebMonitorUI(options.host || "http://localhost:9090", token);
				} else {
					runMonitor(options.host, token);
				}
			},
		});
	});
