import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";
import { runMonitor } from "./monitor-component.js";

// Logout command
program
	.command("monitor")
	.description("Monitor the performance of your workflows")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "monitor",
			args: options,
			execution: async () => {
				runMonitor();
			},
		});
	});
