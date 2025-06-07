import { type INodeBlokResponse, type JsonLikeObject, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";
import pg from "pg";

type PostgresQueryInputs = {
	user: string;
	password: string;
	host: string;
	query: string;
	set_var?: boolean;
};

type Table = {
	total: number;
	data: unknown[];
};

// This is the main class that will be exported
// This class will be used to create a new instance of the node
// This class must be created using the extends NanoService
export default class PostgresQuery extends NodeBlok<PostgresQueryInputs> {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				user: { type: "string" },
				password: { type: "string" },
				host: { type: "string" },
				query: { type: "string" },
				set_var: { type: "boolean" },
			},
			required: ["user", "password", "host", "query"],
		};

		// Set the output "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};
	}

	async handle(ctx: Context, inputs: PostgresQueryInputs): Promise<INodeBlokResponse> {
		// Create a new instance of the response
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			const { Client } = pg;
			const client = new Client({
				user: inputs.user as string,
				password: inputs.password as string,
				host: inputs.host as string,
				port: 5432,
				database: "dvdrental",
			});

			await client.connect();
			const result = await client.query(inputs.query as string);
			await client.end();

			if (Array.isArray(result)) {
				const tables: Table[] = [];

				for (let i = 0; i < result.length; i++) {
					const data = result[i];
					const table: Table = {
						total: data.rows.length,
						data: [...data.rows],
					};

					tables.push(table);
				}

				response.setSuccess(tables as unknown as JsonLikeObject);
			} else {
				response.setSuccess({
					total: result.rowCount as number,
					data: result.rows,
				});
			}
		} catch (error: unknown) {
			let message = (error as Error).message;
			if (error instanceof AggregateError) message = (error as AggregateError).errors[0];
			const nodeError: GlobalError = new GlobalError(message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			nodeError.setJson(undefined); // Return a custom JSON object here

			response.setError(nodeError); // Set the error
		}

		return response;
	}
}
