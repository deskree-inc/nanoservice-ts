import fs from "node:fs";
import { type INodeBlokResponse, type JsonLikeObject, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";

type InputType = {
	path: string;
};

export default class DirectoryManager extends NodeBlok<InputType> {
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

	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			const files: string[] = fs.readdirSync(inputs.path);
			response.setSuccess({
				path: inputs.path,
				files: files as unknown as JsonLikeObject[],
			});
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
