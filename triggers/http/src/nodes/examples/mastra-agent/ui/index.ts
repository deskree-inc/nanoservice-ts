import fs from "node:fs";
import path from "node:path";
import { type INodeBlokResponse, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";
import ejs from "ejs";
import { inputSchema } from "./inputSchema";

const rootDir = path.resolve(__dirname, ".");

type InputType = {
	file_path: string;
	view_path: string;
	title: string;
};

export default class WeatherUI extends NodeBlok<InputType> {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = inputSchema;

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

	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		// Create a new instance of the response
		const response = new NodeBlokResponse();
		let file_path = inputs.file_path as string;
		if (file_path === undefined || file_path === "") file_path = "./app/index.js";
		const react_script_template = '<script type="text/babel">REACT_SCRIPT</script>';

		const view_path = (inputs.view_path as string) || "index.html";
		const title = inputs.title as string;

		try {
			// Load React script from the current module location
			const min_file = this.root(file_path);
			let react_script = fs.readFileSync(min_file, "utf8");
			react_script = react_script_template.replace("REACT_SCRIPT", `\n${react_script}\n`);

			// Read index.html file from the current module location
			const content = fs.readFileSync(this.root(view_path), "utf8");
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

			const html = render({ title, react_script, ctx: btoa(JSON.stringify(ctxCloned)) });

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
