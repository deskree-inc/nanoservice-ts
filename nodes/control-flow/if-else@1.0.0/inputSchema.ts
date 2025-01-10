export const inputSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "Generated schema for Root",
	type: "array",
	items: {
		type: "object",
		properties: {
			type: {
				type: "string",
			},
			steps: {
				type: "array",
				items: {
					type: "object",
					properties: {
						name: {
							type: "string",
						},
						node: {
							type: "string",
						},
						type: {
							type: "string",
						},
					},
					required: ["name", "node", "type"],
				},
			},
			condition: {
				type: "string",
			},
		},
		required: ["type", "steps"],
	},
};
