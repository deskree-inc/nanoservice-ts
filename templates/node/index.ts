import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";

// This is the main class that will be exported
// This class will be used to create a new instance of the node
// This class must be created using the extends NanoService
export default class Node extends NanoService {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {};

		// Set the output "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};
	}

	async handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse> {
		// Create a new instance of the response
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			// Your code here
			response.setSuccess({ message: "Hello World from Node!" }); // Set the success
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			nodeError.setJson(undefined); // Return a custom JSON object here

			response.setError(nodeError); // Set the error
		}

		return response;
	}
}
