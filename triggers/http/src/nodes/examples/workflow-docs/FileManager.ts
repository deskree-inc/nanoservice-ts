import fs from "node:fs";
import { type INanoServiceResponse, NanoService, NanoServiceResponse } from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";

type InputType = {
	path: string;
};

export default class FileManager extends NanoService<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				path: { type: "string" },
			},
			required: ["path"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			const content: string = fs.readFileSync(inputs.path, { encoding: "utf8", flag: "r" });
			response.setSuccess({
				content: content,
			});
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
