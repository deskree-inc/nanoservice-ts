import fs from "node:fs";
import path from "node:path";
import { type INanoServiceResponse, NanoService, NanoServiceResponse } from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import ejs from "ejs";

const rootDir = path.resolve(__dirname, ".");

type InputType = {
	empty: string;
};

export default class WorkflowUI extends NanoService<InputType> {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {};

		// Set the output "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};

		// Set html content type
		this.contentType = "text/html";
	}

	/**
	 * Relative path to root
	 */
	root(relPath: string): string {
		return path.resolve(rootDir, relPath);
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		// Create a new instance of the response
		const response: NanoServiceResponse = new NanoServiceResponse();
		const view_path = "index.html";

		try {
			// Read index.html file from the current module location
			const content = fs.readFileSync(this.root(view_path), "utf8");
			const render = ejs.compile(content, { client: false });
			const html = render({});

			// Your code here
			response.setSuccess(html); // Set the success
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
