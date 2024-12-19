import { type HelperResponse, Workflow } from "nanoservice-ts-helper";
import { beforeAll, expect, test } from "vitest";
import LocalStorage from "../src/LocalStorage";
import type { WorkflowLocator } from "../src/types/GlobalOptions";

let locator: WorkflowLocator = <WorkflowLocator>{};
const storage: LocalStorage = new LocalStorage();

beforeAll(async () => {
	locator = createLocator();
});

function createLocator(): WorkflowLocator {
	const step1Inputs = {
		url: "https://countriesnow.space/api/v0.1/countries/capital",
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		responseType: "application/json",
	};

	const step = Workflow({
		name: "World Countries",
		version: "1.0.0",
		description: "Workflow description",
	})
		.addTrigger("http", {
			method: "GET",
			path: "/",
			accept: "application/json",
		})
		.addStep({
			name: "get-countries-api",
			node: "@nanoservice/api-call",
			type: "module",
			inputs: step1Inputs,
		}) as HelperResponse;

	locator["countries-helper"] = step;

	return locator;
}

test("Load JSON example", async () => {
	expect(async () => await storage.get("countries", locator)).not.toThrow();
});

test("Load Helper example", async () => {
	expect(async () => await storage.get("countries-helper", locator)).not.toThrow();
});

test("Compare JSON vs Helper", async () => {
	const json = await storage.get("countries", locator);
	const helper = await storage.get("countries-helper", locator);

	expect(json).toEqual(helper);
});
