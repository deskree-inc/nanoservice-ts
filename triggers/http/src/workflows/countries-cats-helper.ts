import { AddElse, AddIf, Workflow } from "@nanoservice/helper";

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

export default step;
