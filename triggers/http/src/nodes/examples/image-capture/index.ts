import fs from "node:fs";
import path from "node:path";
import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import ejs from "ejs";

const rootDir = path.resolve(__dirname, ".");

export default class ImageCaptureUI extends NanoService<JsonLikeObject> {
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

	async handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse> {
		// Create a new instance of the response
		const response = new NanoServiceResponse();
		const index_html = "index.html";

		try {
			// Read index.html file from the current module location
			const content = fs.readFileSync(this.root(index_html), "utf8");
			const render = ejs.compile(content, { client: false });
			const ctxCloned = {
				config: ctx.config,
				inputs: inputs,
				response: ctx.response,
				request: {
					body: ctx.request.body,
					headers: ctx.request.headers,
					url: ctx.request.url,
					originalUrl: ctx.request.originalUrl,
					query: ctx.request.query,
					params: ctx.request.params,
					cookies: ctx.request.cookies,
				},
			};

			const html = render({
				ctx: btoa(JSON.stringify(ctxCloned)),
			});

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
