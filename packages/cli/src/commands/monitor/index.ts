import open from "open";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import { runMonitor } from "./monitor-component.js";

// Logout command
program
	.command("monitor")
	.description("Monitor the performance of your workflows")
	.option("--web", "Open the metrics dashboard in your browser")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "monitor",
			args: options,
			execution: async () => {
				if (options.web) {
					const url = "http://localhost:4000/metric/index.html";
					console.log(`Opening: ${url}`);
					await open(url);
				} else {
					runMonitor();
				}
			},
		});
	});
