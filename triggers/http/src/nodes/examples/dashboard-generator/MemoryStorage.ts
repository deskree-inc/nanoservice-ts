import { type INodeBlokResponse, type JsonLikeObject, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";
import InMemory from "./InMemory";

type InputType = {
	action: string; // "get" | "set" | "delete" | "clear"
	key?: string;
	value?: object;
};

export default class MemoryStorage extends NodeBlok<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				action: {
					type: "string",
					enum: ["get", "get-all", "set", "delete", "clear"],
				},
				key: { type: "string" },
				value: { type: "object" },
			},
			required: ["action"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			const cache = InMemory.getInstance();

			switch (inputs.action) {
				case "get": {
					const value = cache.get(inputs.key as string);
					response.setSuccess(value as unknown as JsonLikeObject);
					break;
				}
				case "get-all": {
					response.setSuccess(cache.getAll() as unknown as JsonLikeObject);
					break;
				}
				case "set": {
					cache.set(inputs.key as string, inputs.value as JsonLikeObject);
					response.setSuccess(inputs.value as JsonLikeObject);
					break;
				}
				case "delete": {
					cache.delete(inputs.key as string);
					response.setSuccess(ctx.response.data as JsonLikeObject);
					break;
				}
				case "clear": {
					cache.clear();
					response.setSuccess(ctx.response.data as JsonLikeObject);
					break;
				}
			}
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
