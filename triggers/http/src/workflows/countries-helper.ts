import { type StepHelper, Workflow } from "@blok-ts/runner";

const step1Inputs = {
	url: "https://countriesnow.space/api/v0.1/countries/capital",
	method: "GET",
	headers: {
		"Content-Type": "application/json",
	},
	responseType: "application/json",
};

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
	.addStep({
		name: "get-countries-api",
		node: "@blok-ts/api-call",
		type: "module",
		inputs: step1Inputs,
	});

export default step;
