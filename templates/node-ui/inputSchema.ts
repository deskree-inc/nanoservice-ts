export const inputSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "Generated schema for Root",
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		index_html: {
			type: "string",
		},
		scripts: {
			type: "string",
		},
		react_app: {
			type: "string",
		},
		styles: {
			type: "string",
		},
		root_element: {
			type: "string",
		},
		metas: {
			type: "string",
		},
	},
	required: ["react_app"],
};
