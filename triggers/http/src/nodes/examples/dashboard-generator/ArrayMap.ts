import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
	type ParamsDictionary,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";

type InputType = {
	array: Array<object>;
	map: string;
};

export default class ArrayMapNode extends NanoService<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				array: { type: "array" },
				map: { type: "string" },
			},
			required: ["array", "map"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			if (!Array.isArray(inputs.array)) throw new Error("Array is not an array");

			const result = inputs.array.map((data) => {
				return this.runJs(inputs.map, ctx, data as unknown as ParamsDictionary, undefined, ctx.vars);
			});

			response.setSuccess(result as unknown as JsonLikeObject);
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
