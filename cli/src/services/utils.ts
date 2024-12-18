import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import type { PackageJson } from "type-fest";

export async function getPackageVersion() {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);
	const pkgJsonPath = path.join(__dirname, "..", "..", "package.json");

	const content = (await fs.readJSON(pkgJsonPath)) as PackageJson;
	return content.version;
}
