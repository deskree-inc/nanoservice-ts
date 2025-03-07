import { createOpenAI } from "@ai-sdk/openai";
import {
	type INanoServiceResponse,
	NanoService,
	NanoServiceResponse,
	type ParamsDictionary,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { generateText } from "ai";

type InputType = {
	table_name: string;
	columns: Column[];
	prompt: string;
};

type Column = {
	column_name: string;
	data_type: string;
	primary_key: string;
};

export default class QueryGeneratorNode extends NanoService<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				table_name: { type: "string" },
				columns: {
					type: "array",
					items: {
						type: "object",
						properties: {
							column_name: { type: "string" },
							data_type: { type: "string" },
							primary_key: { type: "string" },
						},
					},
				},
				prompt: { type: "string" },
			},
			required: ["table_name", "columns"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();
		const { table_name: tableName, columns, prompt } = inputs;

		try {
			// Format column information
			const tableSchema = columns
				.map(
					(col) => `${col.column_name} (${col.data_type}${col.column_name === col.primary_key ? ", PRIMARY KEY" : ""})`,
				)
				.join(", ");

			// Generate SQL query using AI
			const openai = createOpenAI({
				compatibility: "strict",
				apiKey: process.env.OPENAI_API_KEY,
			});

			const ai_prompt = `Table: ${tableName}
					 Schema: ${tableSchema}
					 
					 Generate a SQL query for the following request: ${prompt}
					 
					 Return ONLY the SQL query with no explanations, additional text or markdown code group.
					 
					 Double check the query to not include markdown code blocks or any other text that is not a valid SQL query.`;

			const { text: sqlQuery } = await generateText({
				model: openai("gpt-4o"),
				system: `You are a SQL expert. Generate only valid SQL queries without any explanations or markdown. 
					 The query should be executable directly against a PostgreSQL database.`,
				prompt: ai_prompt,
			});

			if (ctx.vars === undefined) ctx.vars = {};
			ctx.vars.query = sqlQuery as unknown as ParamsDictionary;

			response.setSuccess({
				query: sqlQuery,
			});
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
