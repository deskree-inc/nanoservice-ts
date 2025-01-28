import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { inputSchema } from "./inputSchema";
import { runApiCall } from "./util";

export default class ApiCall extends NanoService {
	constructor() {
		super();

		this.inputSchema = inputSchema;
		this.outputSchema = {};
	}

	async handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			const method = inputs.method as string;
			const url = inputs.url as string;
			const headers = inputs.headers as JsonLikeObject;
			const responseType = inputs.responseType as string;
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
