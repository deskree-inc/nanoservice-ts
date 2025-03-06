import { createOpenAI } from "@ai-sdk/openai";
import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
	type ParamsDictionary,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { generateObject } from "ai";
import { z } from "zod";

type InputType = {
	columns: Column[];
	prompt: string;
	set_var?: boolean;
};

type Column = {
	table_name: string;
	column_name: string;
	data_type: string;
	primary_key: string;
};

type Entry = {
	[key: string]: string | number | boolean | JsonLikeObject | JsonLikeObject[];
	items: JsonLikeObject[];
};

export default class MultipleQueryGeneratorNode extends NanoService<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				columns: {
					type: "array",
					items: {
						type: "object",
						properties: {
							table_name: { type: "string" },
							column_name: { type: "string" },
							data_type: { type: "string" },
							primary_key: { type: "string" },
						},
					},
				},
				prompt: { type: "string" },
				set_var: { type: "boolean" },
			},
			required: ["columns", "prompt"],
		};
	}

	groupBy(key: string, array: JsonLikeObject[]): JsonLikeObject[] {
		const result: Entry[] = [];
		for (let i = 0; i < array.length; i++) {
			let added = false;
			for (let j = 0; j < result.length; j++) {
				if (result[j][key] === array[i][key]) {
					result[j].items.push(array[i]);
					added = true;
					break;
				}
			}
			if (!added) {
				const entry: Entry = { items: [] };
				entry[key] = array[i][key] as unknown as JsonLikeObject;
				entry.items.push(array[i]);
				result.push(entry);
			}
		}
		return result;
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();
		const { columns, prompt } = inputs;

		try {
			// Generate SQL query using AI
			const openai = createOpenAI({
				compatibility: "strict",
				apiKey: process.env.OPENAI_API_KEY,
			});

			// Format column information
			const grouped = this.groupBy("table_name", columns) as {
				table_name: string;
				items: Column[];
			}[];

			const tableSchema: string[] = [];
			for (const group of grouped) {
				tableSchema.push(`Table: ${group.table_name}`);
				const tableSchemaGroup: string[] = group.items.map(
					(col) =>
						`- ${col.column_name} (${col.data_type}${col.column_name === col.primary_key ? ", PRIMARY KEY" : ""})`,
				);

				for (const col of tableSchemaGroup) {
					tableSchema.push(col);
				}
				tableSchema.push("");
			}

			const result = await generateObject({
				model: openai("gpt-4o", {
					structuredOutputs: true,
				}),
				schemaName: "queries",
				schemaDescription: "Generate SQL queries for data visualization in a PostgreSQL",
				schema: z.object({
					prompt: z.string(),
					queries: z.array(
						z.object({
							query: z.string(),
							chart_title: z.string(),
							chart_type: z.string(),
						}),
					),
				}),
				system: `You are a PostgreSQL expert SQL developer and data analyst with deep knowledge of database systems and data visualization best practices. Your task is to generate efficient, accurate, and optimized SQL queries to extract data for visualization in dashboards and reports. Follow these guidelines:
				Understand the Data Structure:
				Tables and their relationships (e.g., primary keys, foreign keys).
				Columns and their data types (e.g., dates, numbers, text).

				Focus on Visualization Needs:
				Queries should return aggregated or summarized data suitable for charts (e.g., "bar" | "line" | "pie" | "doughnut" | "scatter").
				Include necessary calculations (e.g., sums, averages, counts, percentages).
				Ensure the output is clean and ready for visualization tools (e.g., Tableau, Power BI, Looker).

				Optimize for Performance:
				Use efficient SQL techniques (e.g., indexing, joins, subqueries).
				Avoid unnecessary complexity unless required for the visualization.
				Use efficient aggregation functions (e.g., SUM, AVG, COUNT).
				Use efficient the JOIN and table ALIAS to avoid errors in the SQL Query.

				Provide Context:
				Explain the purpose of the query and how it relates to the visualization.
				Suggest the type of chart that would best represent the data.

				Handle Edge Cases:
				Account for null values, duplicates, or outliers if they could impact the visualization.

				Output Format:
				Provide the PostgreSQL SQL query in a clean, readable format.
				Include comments to explain key parts of the query.
				
				TABLES SCHEMA:
				
				${tableSchema.join("\n")}

				LEARN the TABLES SCHEMA carefully before generating the SQL queries.
				
				Return the response as a JSON array with the following schema:
				{
					"query": "SELECT ...",
					"chart_title": "Top 5 Categories by Total Sales", // example data visualization title
					"chart_type": "bar" | "line" | "pie" | "doughnut" | "scatter" // example data visualization type
				}

				WARNING: 
				1- Force the output to always be in JSON FORMAT. Double check the output to ensure it is in JSON format.
				2- Make sure the SQL queries are executable directly against a PostgreSQL database.
				3- Includes the table and columns defined in the tables schema above.
				4- Use efficient the JOIN and table ALIAS to avoid errors in the SQL Query.

				ERRORS:
				AVOID the error: column c.category does not exist
				AVOID the error: column c.country does not exist
				AVOID the error: missing FROM-clause entry for table "s"
				AVOID the error: column c.category does not exist
				AVOID JOIN errors validating multiple times the JOINs and the table ALIAS.
				`,
				prompt: prompt,
				temperature: 0.2,
				maxTokens: 1000,
			});

			console.log("QUERIES", prompt, result.object.queries);

			if (inputs.set_var) {
				if (ctx.vars === undefined) ctx.vars = {};
				ctx.vars[this.name] = {
					total: result.object.queries.length,
					data: result.object,
				} as unknown as ParamsDictionary;

				response.setSuccess((ctx.response?.data as JsonLikeObject) || {});
			} else {
				response.setSuccess({
					total: result.object.queries.length,
					data: result.object,
				});
			}
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
