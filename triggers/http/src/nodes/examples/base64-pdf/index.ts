import { type INodeBlokResponse, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";

type InputType = {
	base64: string;
};

/**
 * Represents a Node service that extends the NanoService class.
 * This class is responsible for handling requests and providing responses
 * with automated validation using JSON Schema.
 */
export default class Base64ToPDF extends NodeBlok<InputType> {
	/**
	 * Initializes a new instance of the Node class.
	 * Sets up the input and output JSON Schema for automated validation.
	 */
	constructor() {
		super();
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {
			type: "object",
			properties: {
				base64: { type: "string" },
			},
			required: ["base64"],
		};
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};
		this.contentType = "application/pdf";
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
	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			// Decode base64 to PDF
			const base64 = inputs.base64;
			const pdf = Buffer.from(base64, "base64");

			// Return the decoded PDF buffer in the response
			response.setSuccess(pdf as unknown as string);
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
