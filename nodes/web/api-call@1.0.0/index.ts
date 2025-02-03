import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { inputSchema } from "./inputSchema";
import { runApiCall } from "./util";

export type InputType = {
	method: string;
	url: string;
	headers: JsonLikeObject;
	responseType: string;
	body: JsonLikeObject;
};

export default class ApiCall extends NanoService<InputType> {
	constructor() {
		super();

		this.inputSchema = inputSchema;
		this.outputSchema = {};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			const method = inputs.method;
			const url = inputs.url;
			const headers = inputs.headers;
			const responseType = inputs.responseType;
			const body = inputs.body || ctx.response.data;

			const result = await runApiCall(url, method, headers, body as JsonLikeObject, responseType);
			response.setSuccess(result);
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			response.setError(nodeError);
		}

		return response;
	}
}
