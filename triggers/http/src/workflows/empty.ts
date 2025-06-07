import { AddElse, AddIf, type StepHelper, Workflow } from "@blok-ts/runner";

const step: StepHelper = Workflow({
	name: "Empty",
	version: "1.0.0",
	description: "Workflow for load testing",
})
	.addTrigger("http", {
		method: "GET",
		path: "/",
		accept: "application/json",
	})
	.addCondition({
		node: {
			name: "filter-request",
			node: "@blok-ts/if-else",
			type: "module",
		},
		conditions: () => {
			return [new AddIf('ctx.request.query.countries === "true"').build(), new AddElse().build()];
		},
	});

export default step;
