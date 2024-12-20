import type { BlueprintContext } from "@deskree/blueprint-shared";
import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "nanoservice-ts-runner";
import { inputSchema } from "./inputSchema";
import { runApiCall } from "./util";

export default class ApiCall extends NanoService {
	constructor() {
		super();

		this.inputSchema = inputSchema;
		this.outputSchema = {};
	}

	async handle(ctx: BlueprintContext, inputs: JsonLikeObject): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			const method = inputs.method as string;
			const url = inputs.url as string;
			const headers = inputs.headers as JsonLikeObject;
			const responseType = inputs.responseType as string;
			const body = inputs.body || ctx.response.data;

			const result = await runApiCall(url, method, headers, body, responseType);
			response.setSuccess(result);
		} catch (error: unknown) {
			this.setError(
				this.setError({
					message: (error as Error).message,
					stack: (error as Error).stack,
					code: 500,
				}),
			);
		}

		return response;
	}
}
