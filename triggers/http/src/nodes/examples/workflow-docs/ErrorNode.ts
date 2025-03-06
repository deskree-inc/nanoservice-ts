import { type INanoServiceResponse, NanoService, NanoServiceResponse } from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";

type ErrorNodeInputs = {
	message: string;
};

export default class ErrorNode extends NanoService<ErrorNodeInputs> {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-07/schema#",
			title: "Generated schema for Root",
			type: "object",
			properties: {
				message: {
					type: "string",
				},
			},
			required: ["message"],
		};

		// Set the output "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};

		// Set html content type
		this.contentType = "text/html";
	}

	async handle(ctx: Context, inputs: ErrorNodeInputs): Promise<INanoServiceResponse> {
		// Create a new instance of the response
		const response = new NanoServiceResponse();
		const message = inputs.message as string;

		try {
			throw new Error(message);
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			response.setError(nodeError); // Set the error
		}

		return response;
	}
}
