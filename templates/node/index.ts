import { type INanoServiceResponse, NanoService, NanoServiceResponse } from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";

type InputType = {
	message?: string;
};

/**
 * Represents a Node service that extends the NanoService class.
 * This class is responsible for handling requests and providing responses
 * with automated validation using JSON Schema.
 */
export default class Node extends NanoService<InputType> {
	/**
	 * Initializes a new instance of the Node class.
	 * Sets up the input and output JSON Schema for automated validation.
	 */
	constructor() {
		super();
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {};
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};
	}

	/**
	 * Handles the incoming request and returns a response.
	 *
	 * @param ctx - The context of the request.
	 * @param inputs - The input data for the request.
	 * @returns A promise that resolves to an INanoServiceResponse object.
	 *
	 * The method tries to execute the main logic and sets a success message in the response.
	 * If an error occurs, it catches the error, creates a GlobalError object, sets the error details,
	 * and sets the error in the response.
	 */
	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			// Your code here
			response.setSuccess({ message: inputs.message || "Hello World from Node!" });
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			nodeError.setJson(undefined);

			response.setError(nodeError);
		}

		return response;
	}
}
