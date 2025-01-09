import {
	type BlueprintContext,
	BlueprintNode,
	type ConfigContext,
	type ResponseContext,
} from "@deskree/blueprint-shared";
import _ from "lodash";
import type { ParamsDictionary } from "nanoservice-ts-runner";

export default class ApiCall extends BlueprintNode {
	async run(ctx: BlueprintContext): Promise<ResponseContext> {
		this.contentType = "application/json";
		const response: ResponseContext = { success: true, data: {}, error: null };
		const data = ctx.response.data || ctx.request.body;

		try {
			this.validate(ctx);
			const config = _.cloneDeep(ctx.config) as ConfigContext;
			let opts = (config as ParamsDictionary)[this.name] as unknown as NodeOptions;

			opts = this.blueprintMapper(opts, ctx, data);

			const method = opts.inputs.method;
			const url = opts.inputs.url;
			const headers = opts.inputs.headers;
			const responseType = opts.inputs.responseType;
			let body = opts.inputs.body;
			const custom_var = opts.inputs.var;

			if (!body) body = data;

			const result = await this.runApiCall(url, method, headers, body, responseType);

			// @ts-ignore
			if (
				custom_var &&
				(result as ParamsDictionary).errors === undefined &&
				(result as ParamsDictionary).error === undefined
			) {
				if (ctx.vars === undefined) ctx.vars = {};
				ctx.vars[custom_var] = result;
			} else {
				response.data = result;
			}
		} catch (error: unknown) {
			response.error = this.setError({
				message: (error as Error).message,
				stack: (error as Error).stack,
				code: 500,
			});
			response.success = false;
		}

		return response;
	}

	runApiCall = async (
		url: string,
		method: string,
		headers: ParamsDictionary,
		body: ParamsDictionary,
		responseType: string,
	) => {
		const options: {
			method: string;
			headers: ParamsDictionary;
			redirect: "follow";
			responseType: string;
			body: string | undefined;
		} = {
			method,
			headers,
			redirect: "follow",
			responseType,
			body: typeof body === "string" ? body : JSON.stringify(body),
		};

		if (method === "GET") options.body = undefined;

		const response: Response = await fetch(url, options);
		let parsedResponse: string | ParamsDictionary;
		if (response.headers.get("content-type")?.includes("application/json")) {
			parsedResponse = await response.json();
		} else {
			parsedResponse = await response.text();
		}
		if (!response.ok) throw new Error(parsedResponse as string);
		return parsedResponse;
	};

	validate(ctx: BlueprintContext) {
		if (ctx.config === undefined) throw new Error(`${this.name} node requires a config`);
		const opts = (ctx.config as ParamsDictionary)[this.name] as unknown as NodeOptions;

		if (opts?.inputs?.url === undefined) throw new Error(`${this.name} requires a valid url`);
		if (opts?.inputs?.method === undefined) throw new Error(`${this.name} requires a valid method`);
	}
}

type NodeOptions = {
	inputs: {
		url: string;
		method: string;
		headers: ParamsDictionary;
		responseType: string;
		body: ParamsDictionary;
		var: string;
	};
};
