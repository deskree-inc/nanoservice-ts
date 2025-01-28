import { type ConfigContext, type Context, NodeBase, type ResponseContext } from "@nanoservice-ts/shared";
import type ParamsDictionary from "@nanoservice-ts/shared/dist/types/ParamsDictionary";
import { metrics } from "@opentelemetry/api";
import { type Schema, type ValidationError, Validator } from "jsonschema";
import _ from "lodash";
import type { INanoServiceResponse } from "./NanoServiceResponse";
import type RunnerNode from "./RunnerNode";
import type JsonLikeObject from "./types/JsonLikeObject";

export default abstract class NanoService extends NodeBase {
	public inputSchema: Schema;
	public outputSchema: Schema;
	private v: Validator;

	constructor() {
		super();
		this.inputSchema = {};
		this.outputSchema = {};
		this.v = new Validator();
	}

	public setSchemas(input: Schema, output: Schema) {
		this.inputSchema = input;
		this.outputSchema = output;
	}

	public getSchemas() {
		return {
			input: this.inputSchema,
			output: this.outputSchema,
		};
	}

	public async run(ctx: Context): Promise<ResponseContext> {
		const response: ResponseContext = { success: true, data: {}, error: null };
		const defaultMeter = metrics.getMeter("default");
		const start = performance.now();
		ctx.logger.log(`Running node: ${this.name} [${JSON.stringify(this.originalConfig)}]`);

		const node_execution = defaultMeter.createCounter("node", {
			description: "Node requests",
		});

		const node_time = defaultMeter.createGauge("node_time", {
			description: "Node elapsed time",
		});

		const config = _.cloneDeep(ctx.config) as ConfigContext;
		let opts: JsonLikeObject = (config as JsonLikeObject)[this.name] as unknown as JsonLikeObject;
		const data = ctx.response?.data || ctx.request?.body;
		const inputs = opts.inputs || opts.conditions;

		opts = this.blueprintMapper(
			opts as unknown as ParamsDictionary,
			ctx,
			data as ParamsDictionary,
		) as unknown as JsonLikeObject;
		await this.validate(inputs as JsonLikeObject, this.inputSchema);

		// Process node custom logic
		const result = await this.handle(ctx, inputs as JsonLikeObject);
		this.v.validate(result, this.outputSchema);
		const end = performance.now();

		node_execution.add(1, {
			env: process.env.NODE_ENV,
			workflow_runner_path: `${ctx.workflow_path}`,
			workflow_runner_name: `${ctx.workflow_name}`,
			node_name: `${this.name}`,
			node: (this as unknown as RunnerNode).node,
		});

		node_time.record(end - start, {
			env: process.env.NODE_ENV,
			workflow_runner_path: `${ctx.workflow_path}`,
			workflow_runner_name: `${ctx.workflow_name}`,
			node_name: `${this.name}`,
			node: (this as unknown as RunnerNode).node,
		});

		ctx.logger.log(`Executed node: ${this.name} in ${(end - start).toFixed(2)}ms`);

		response.data = result;
		(response.data as unknown as NanoService).contentType = this.contentType;

		return response;
	}

	public abstract handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse | NanoService[]>;

	public async validate(obj: JsonLikeObject, schema: Schema): Promise<void> {
		const result = this.v.validate(obj, schema);
		if (result.valid === false) {
			const errors: string[] = [];
			for (let i = 0; i < result.errors.length; i++) {
				const error: ValidationError = result.errors[i];
				errors.push(error.message);
			}
			throw new Error(errors.join(", "));
		}
	}
}
