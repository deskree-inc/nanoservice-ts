import fs from "fs-extra";
import { expect, test, vi } from "vitest";
import { build } from "../../../src/commands/build";
import { tokenManager } from "../../../src/services/local-token-manager.js";
import * as utils from "../../../src/services/utils.js";

vi.mock("fs-extra");
vi.mock("../../../src/services/local-token-manager.js");
vi.mock("../../../src/services/constants.js", () => ({
	NANOSERVICE_URL: "http://mock-nanoservice-url.com",
}));

test("build - successful build", async () => {
	vi.spyOn(fs, "existsSync").mockImplementation((path) => {
		if (String(path).includes("Dockerfile") || String(path).includes(".nanoservice.json")) return true;
		return false;
	});
	vi.spyOn(fs, "readJSONSync").mockReturnValue({});
	vi.spyOn(fs, "writeJSONSync").mockImplementation(() => {});
	vi.spyOn(fs, "ensureFileSync").mockImplementation(() => {});
	vi.spyOn(fs, "removeSync").mockImplementation(() => {});
	vi.spyOn(tokenManager, "getToken").mockReturnValue("mock-token");
	vi.spyOn(utils, "getPackageVersion").mockResolvedValue("1.0.0");

	await expect(build({ directory: "test" })).resolves.not.toThrow();
});

test("build - missing directory", async () => {
	vi.spyOn(fs, "existsSync").mockReturnValue(false);

	await expect(build({ directory: "missing-dir" })).resolves.toBeFalsy();
});

test("build - missing Dockerfile", async () => {
	vi.spyOn(fs, "existsSync").mockImplementation((path) => {
		if (String(path).includes("Dockerfile")) return false;
		return true;
	});

	await expect(build({ directory: "test" })).resolves.toBeFalsy();
});

test("build - authentication failure", async () => {
	vi.spyOn(fs, "existsSync").mockImplementation((path) => {
		if (String(path).includes("Dockerfile") || String(path).includes(".nanoservice.json")) return true;
		return false;
	});
	vi.spyOn(tokenManager, "getToken").mockReturnValue(null);

	await expect(build({ directory: "test" })).resolves.toBeFalsy();
});
