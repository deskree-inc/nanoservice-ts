import * as p from "@clack/prompts";
import { type OptionValues, program, trackCommandExecution } from "../../services/commander.js";

import { tokenManager } from "../../services/local-token-manager.js";

export async function login(opts: OptionValues) {
	let token = tokenManager.getToken();
	const BLOK_TOKEN = process.env.BLOK_TOKEN as string;

	// const resolveTokenType = async (): Promise<string> => {
	// 	const tokenType = await p.select({
	// 		message: "Choose the authentication method",
	// 		options: [
	// 			{ value: "token", label: "Provide token manually", hint: "Recommended" },
	// 			{ value: "token", label: "Authenticate via web", hint: "Comming soon" },
	// 		],
	// 	});

	// 	if (p.isCancel(tokenType)) {
	// 		p.cancel("Authentiecation cancelled.");
	// 		process.exit(0);
	// 	}

	// 	return tokenType;
	// };

	const resolveToken = async (): Promise<string> => {
		let token = process.env.BLOK_TOKEN;
		if (token) return token;
		token = (await p.password({
			message:
				"Please provide the token for authentication. You can create it on https://atomic.deskree.com/auth/access/token",
		})) as string;

		if (p.isCancel(token)) {
			p.cancel("Authentication cancelled.");
			process.exit(0);
		}

		return token;
	};

	try {
		if (!token && !BLOK_TOKEN && !opts.token) {
			// const tokenType = await resolveTokenType();
			// if (tokenType === "token")
			token = await resolveToken();
		} else if (opts.token) {
			token = opts.token;
		} else if (BLOK_TOKEN) {
			token = BLOK_TOKEN;
		}

		p.log.success("Login successful.");
		if (!token) throw new Error("BLOK_TOKEN is required.");

		const isStored = tokenManager.storeToken(token);
		if (!isStored) throw new Error("Failed to store the token.");
		p.log.info("You can now use the CLI commands. For help, run: blokctl --help");
	} catch (error) {
		p.log.error("Login failed. Please try again.");
		p.log.error((error as Error).message);
		process.exit(1);
	}
}

// Login command
program
	.command("login")
	.description("Login to Bloks")
	.option("-t, --token <value>", "Login with a token")
	.action(async (options: OptionValues) => {
		await trackCommandExecution({
			command: "login",
			args: options,
			execution: async () => {
				await login(options);
			},
		});
	});
