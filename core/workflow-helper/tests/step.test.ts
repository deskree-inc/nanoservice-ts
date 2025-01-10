import { beforeAll, expect, test } from "vitest";
import type StepNode from "../src/components/StepNode";
import Workflow from "../src/components/Workflow";
import { StepOptsSchema } from "../src/types/StepOpts";
let trigger: StepNode = <StepNode>{};

beforeAll(() => {
	const workflow = Workflow({
		name: "World Countries",
		version: "1.0.0",
		description: "Workflow description",
	});

	trigger = workflow.addTrigger("http", {
		method: "GET",
		path: "/",
		accept: "application/json",
	});
});

test("Initialize the workflow with inputs", (t) => {
	const step = trigger.addStep({
		name: "get-countries-api",
		node: "@nanoservice/api-call",
		type: "module",
		inputs: {
			url: "https://countriesnow.space/api/v0.1/countries/capital",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			responseType: "application/json",
		},
	});

	const model = JSON.parse(step.toJson()).steps[0];

	expect(() => StepOptsSchema.parse(model)).not.toThrow();
});

test("Initialize the workflow without inputs", (t) => {
	const step = trigger.addStep({
		name: "get-countries-api",
		node: "@nanoservice/api-call",
		type: "module",
	});

	const model = JSON.parse(step.toJson()).steps[0];

	expect(() => StepOptsSchema.parse(model)).not.toThrow();
});

test("Initialize the workflow without inputs", (t) => {
	expect(() =>
		trigger.addStep({
			name: "",
			node: "@nanoservice/api-call",
			type: "module",
		}),
	).toThrow();
});
