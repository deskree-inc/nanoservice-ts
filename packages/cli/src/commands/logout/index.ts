import child_process from "node:child_process";
import util from "node:util";
import * as p from "@clack/prompts";
import type { OptionValues } from "commander";

import { tokenManager } from "../../services/local-token-manager.js";

const exec = util.promisify(child_process.exec);

export async function logout(opts: OptionValues) {
	tokenManager.clearToken();
	exec("unset NANOSERVICES_TOKEN");
	p.log.success("Logged out successfully.");
	p.log.info("You can log in again using: nanoctl login");
}
