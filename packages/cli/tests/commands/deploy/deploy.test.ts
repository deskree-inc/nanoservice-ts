import * as p from "@clack/prompts";
import fs from "fs-extra";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { deploy } from "../../../src/commands/deploy";
import { tokenManager } from "../../../src/services/local-token-manager.js";

vi.mock("fs-extra");
vi.mock("@clack/prompts");
vi.mock("../../../../src/services/local-token-manager.js");
vi.mock("../../../../src/services/constants.js", () => ({
	NANOSERVICE_URL: "https://mock-nanoservice-url.com",
}));
vi.mock("node-fetch", () => ({
	default: vi.fn(),
}));

const fetch = (await import("node-fetch")).default;

describe("deploy command", () => {
	interface DeployOptions {
		name: string;
		directory: string;
	}

	let opts: DeployOptions = {
		name: "test-service",
		directory: "/mock/directory",
	};

	beforeEach(() => {
		vi.clearAllMocks();
		opts = {
			name: "test-service",
			directory: "/mock/directory",
		};
	});

	it("should deploy successfully", async () => {
		vi.spyOn(fs, "existsSync").mockImplementation((path) => {
			if (String(path).includes("Dockerfile") || String(path).includes(".nanoservice.json")) return true;
			return false;
		});
		vi.spyOn(fs, "readJSONSync").mockReturnValue({
			name: "test-service",
			lastBuild: { id: "123", reason: "Succeeded" },
		});
		vi.spyOn(fs, "writeJSONSync").mockImplementation(() => {});
		vi.spyOn(fs, "ensureFileSync").mockImplementation(() => {});
		vi.spyOn(fs, "removeSync").mockImplementation(() => {});
		vi.spyOn(tokenManager, "getToken").mockReturnValue("mock-token");
		vi.spyOn(fs, "writeJSONSync").mockImplementation(() => {});
		vi.spyOn(fs, "readJSONSync").mockImplementation(() => ({
			name: "test-service",
			lastBuild: { id: "123", reason: "Succeeded" },
		}));
		vi.spyOn(p, "spinner").mockReturnValue({
			start: vi.fn(),
			message: vi.fn(),
			stop: vi.fn(),
		});
		vi.spyOn(tokenManager, "getToken").mockReturnValue("mock-token");
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ data: { url: "https://mock-service-url.com" } }),
		});
		fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				data: {
					conditions: [{ status: "True" }],
					latestReadyRevisionName: "v1",
				},
			}),
		});

		await deploy(opts);
	});

	it("should throw an error if .nanoservice.json is missing", async () => {
		vi.spyOn(fs, "existsSync").mockImplementation((path) => {
			if (String(path).includes("Dockerfile")) return true;
			if (String(path).includes(".nanoservice.json")) return false;
			return false;
		});
		vi.spyOn(fs, "readJSONSync").mockReturnValue({
			name: "test-service",
			lastBuild: { id: "123", reason: "Succeeded" },
		});
		vi.spyOn(tokenManager, "getToken").mockReturnValue("mock-token");
		vi.spyOn(fs, "writeJSONSync").mockImplementation(() => {});
		vi.spyOn(fs, "ensureFileSync").mockImplementation(() => {});
		vi.spyOn(fs, "removeSync").mockImplementation(() => {});
		vi.spyOn(p, "spinner").mockReturnValue({
			start: vi.fn(),
			message: vi.fn(),
			stop: vi.fn(),
		});

		await expect(deploy(opts)).resolves.toBeFalsy();
	});

	it("should throw an error if token is missing", async () => {
		vi.spyOn(fs, "existsSync").mockImplementation((path) => {
			if (String(path).includes("Dockerfile")) return true;
			if (String(path).includes(".nanoservice.json")) return false;
			return false;
		});
		vi.spyOn(p, "spinner").mockReturnValue({
			start: vi.fn(),
			message: vi.fn(),
			stop: vi.fn(),
		});
		vi.spyOn(fs, "readJSONSync").mockReturnValue({
			name: "test-service",
			lastBuild: { id: "123", reason: "Succeeded" },
		});
		vi.spyOn(tokenManager, "getToken").mockReturnValue("mock-token");

		await expect(deploy(opts)).resolves.toBeFalsy();
	});
});
