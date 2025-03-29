import * as p from "@clack/prompts";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

// import { tokenManager } from "../../services/local-token-manager.js";

async function deploy(opts: OptionValues) {
	p.log.success("deploy command executed");
}

program
	.command("deploy")
	.description("Deploy nanoservice")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "deploy",
			args: options,
			execution: async () => {
				await deploy(options);
			},
		});
	});
