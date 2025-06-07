import { AddElse, AddIf, type StepHelper, Workflow } from "@blok-ts/runner";

const step: StepHelper = Workflow({
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
			node: "@blok-ts/if-else",
			type: "module",
		},
		conditions: () => {
			return [
				new AddIf('ctx.request.query.countries === "true"')
					.addStep({
						name: "get-countries",
						node: "@blok-ts/api-call",
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
						node: "@blok-ts/api-call",
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

export default step;
