export const inputSchema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "Generated schema for Root",
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		view_path: {
			type: "string",
		},
		file_path: {
			type: "string",
		},
	},
	required: ["title", "file_path"],
};
