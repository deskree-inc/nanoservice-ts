import * as p from "@clack/prompts";
import type { OptionValues } from "commander";

import { tokenManager } from "../../services/local-token-manager.js";

export async function logout(opts: OptionValues) {
	tokenManager.clearToken();
	p.log.success("Logged out successfully.");
	p.log.info("You can log in again using: nanoctl login");
}
