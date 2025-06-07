import { expect, test } from "vitest";
import HelperResponse from "../../src/helper/components/HelperResponse";
import Workflow from "../../src/helper/components/Workflow";
import { type WorkflowOpts, WorkflowOptsSchema } from "../../src/helper/types/WorkflowOpts";

test("Initialize the workflow with error", (t) => {
	expect(() =>
		Workflow({
			name: "",
			version: "",
			description: "",
		}),
	).toThrow();
});

test("Initialize the workflow without error", (t) => {
	expect(() =>
		Workflow({
			name: "Workflow Demo",
			version: "1.0.0",
			description: "",
		}),
	).not.toThrow();
});

test("Validate Response", (t) => {
	const response = Workflow({
		name: "Workflow Demo",
		version: "1.0.0",
		description: "",
	});

	expect(response).toBeInstanceOf(HelperResponse);
});

test("Validate JSON", (t) => {
	const response = Workflow({
		name: "Workflow Demo",
		version: "1.0.0",
		description: "",
	});

	const jsonResponse = JSON.parse(response.toJson()) as WorkflowOpts;

	expect(() => WorkflowOptsSchema.parse(jsonResponse)).not.toThrow();
});
