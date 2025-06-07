import { type INodeBlokResponse, type JsonLikeObject, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";

type InputType = {
	model: object;
};

export default class MapperNode extends NodeBlok<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				model: { type: "object" },
			},
			required: ["model"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			response.setSuccess(inputs.model as JsonLikeObject);
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
