import { type Context, GlobalError } from "@nanoservice-ts/shared";
import NanoService from "./NanoService";
import NanoServiceResponse, { type INanoServiceResponse } from "./NanoServiceResponse";
import type { NodeRequest, NodeResponse } from "./NodeGrpcClient";
import NodeGrpcNativeClient from "./NodeGrpcNativeClient";
import type RunnerNode from "./RunnerNode";
import type ParamsDictionary from "./types/ParamsDictionary";

export default class NodeRuntime extends NanoService<ParamsDictionary> {
	protected host: string;
	protected port: number;

	constructor() {
		super();
		this.host = "127.0.0.1";
		this.port = 50051;
		this.inputSchema = {};
		this.outputSchema = {};
	}

	assignHostAndPort(host: string, port: number): void {
		this.host = host;
		this.port = port;
	}

	async handle(ctx: Context, inputs: ParamsDictionary): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			const context = this.createContext(ctx, inputs);
			const nodeRequest = this.createNodeRequest(context);
			const client = new NodeGrpcNativeClient(this.host, this.port);
			const model = await client.call(nodeRequest);
			const decodedResponse = this.createNodeResponse(model);

			response.setSuccess(decodedResponse);
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			nodeError.setJson(undefined);

			response.setError(nodeError);
		}

		return response;
	}

	createNodeResponse(response: NodeResponse): ParamsDictionary {
		const decodedResponse = Buffer.from(response.Message, "base64").toString("utf-8");
		const parsedResponse = JSON.parse(decodedResponse);

		return parsedResponse;
	}

	createNodeRequest(context: ParamsDictionary): NodeRequest {
		const base64Context = Buffer.from(JSON.stringify(context)).toString("base64");
		const request = {
			Name: (this as unknown as RunnerNode).node,
			Message: base64Context,
			Encoding: "BASE64",
			Type: "JSON",
		};

		return request as NodeRequest;
	}

	createContext(ctx: Context, config: ParamsDictionary): ParamsDictionary {
		return {
			request: {
				body: ctx.request.body,
				headers: ctx.request.headers,
				params: ctx.request.params,
				query: ctx.request.query,
				method: ctx.request.method,
				url: ctx.request.url,
				cookies: ctx.request.cookies,
				baseUrl: ctx.request.baseUrl,
			},
			response: ctx.response,
			vars: ctx.vars,
			env: ctx.env,
			config: config,
		} as unknown as ParamsDictionary;
	}
}
