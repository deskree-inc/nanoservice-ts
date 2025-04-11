import * as p from "@clack/prompts";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

import { tokenManager } from "../../services/local-token-manager.js";

export async function logout(opts: OptionValues) {
	tokenManager.clearToken();
	p.log.success("Logged out successfully.");
	p.log.info("You can log in again using: nanoctl login");
}

// Logout command
program
	.command("logout")
	.description("Logout from Nanoservices")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "logout",
			args: options,
			execution: async () => {
				await logout(options);
			},
		});
	});
