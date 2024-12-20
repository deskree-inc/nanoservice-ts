import { AddElse, AddIf, Workflow } from "@nanoservice-ts/helper";
import { beforeAll, expect, test } from "vitest";
import LocalStorage from "../src/LocalStorage";
import type { WorkflowLocator } from "../src/types/GlobalOptions";

let locator: WorkflowLocator = <WorkflowLocator>{};
const storage: LocalStorage = new LocalStorage();

beforeAll(async () => {
	locator = createLocator();
});

function createLocator(): WorkflowLocator {
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
		.addCondition({
			node: {
				name: "filter-request",
				node: "control-flow/if-else@1.0.0",
				type: "local",
			},
			conditions: () => {
				return [
					new AddIf('ctx.request.query.countries === "true"')
						.addStep({
							name: "get-countries",
							node: "@nanoservice/api-call",
							type: "module",
							inputs: {
								url: "https://countriesnow.space/api/v0.1/countries",
								method: "GET",
								headers: {
									"Content-Type": "application/json",
								},
								responseType: "application/json",
							},
						})
						.build(),
					new AddElse()
						.addStep({
							name: "get-facts",
							node: "@nanoservice/api-call",
							type: "module",
							inputs: {
								url: "https://catfact.ninja/fact",
								method: "GET",
								headers: {
									"Content-Type": "application/json",
								},
								responseType: "application/json",
							},
						})
						.build(),
				];
			},
		});

	locator["countries-vs-facts"] = step;

	return locator;
}

test("Compare JSON vs Helper", async () => {
	const json = await storage.get("countries-vs-facts", locator);
	const helper = await storage.get("countries-vs-facts", locator);

	expect(json).toEqual(helper);
});
