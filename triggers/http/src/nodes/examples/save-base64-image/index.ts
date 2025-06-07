import fs from "node:fs";
import path from "node:path";
import { type INodeBlokResponse, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";

type InputType = {
	base64: string;
	dir_path?: string;
};

/**
 * Represents a Node service that extends the NanoService class.
 * This class is responsible for handling requests and providing responses
 * with automated validation using JSON Schema.
 */
export default class SaveImageBase64 extends NodeBlok<InputType> {
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
				dir_path: { type: "string" },
			},
			required: ["base64"],
		};
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
	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			const { base64: base64Image, dir_path } = inputs;

			const timestamp = Date.now();
			const randomString = Math.random().toString(36).substring(2, 8);
			const fileName = `img_${timestamp}_${randomString}`;

			const outputPath = `${dir_path}/images/examples`;

			if (!fs.existsSync(outputPath)) {
				fs.mkdirSync(outputPath, { recursive: true });
			}

			let base64Data = base64Image;
			let imageExtension = "png";

			if (base64Image.includes(";base64,")) {
				const matches = base64Image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
				if (matches && matches.length === 3) {
					imageExtension = matches[1];
					base64Data = matches[2];
				} else {
					base64Data = base64Image.split(";base64,").pop() as string;
				}
			}

			const buffer = Buffer.from(base64Data, "base64");
			const fullFilePath = path.join(outputPath, `${fileName}.${imageExtension}`);

			fs.writeFileSync(fullFilePath, buffer);

			response.setSuccess({
				local_path: fullFilePath,
				url_path: `/images/examples/${fileName}.${imageExtension}`,
			});
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
