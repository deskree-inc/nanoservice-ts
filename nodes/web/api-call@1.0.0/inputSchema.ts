export const inputSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "Generated schema for Root",
	type: "object",
	properties: {
		url: {
			type: "string",
		},
		method: {
			type: "string",
		},
		body: {
			type: "object",
			properties: {},
		},
		headers: {
			type: "object",
			properties: {},
		},
		responseType: {
			type: "string",
		},
	},
	required: ["url", "method"],
};
