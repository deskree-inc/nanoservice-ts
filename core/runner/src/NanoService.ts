import { type ConfigContext, type Context, Metrics, NodeBase, type ResponseContext } from "@nanoservice-ts/shared";
import type ParamsDictionary from "@nanoservice-ts/shared/dist/types/ParamsDictionary";
import type VarsContext from "@nanoservice-ts/shared/dist/types/VarsContext";
import { metrics } from "@opentelemetry/api";
import { type Schema, type ValidationError, Validator } from "jsonschema";
import _ from "lodash";
import type { INanoServiceResponse } from "./NanoServiceResponse";
import type RunnerNode from "./RunnerNode";
import type Condition from "./types/Condition";
import type JsonLikeObject from "./types/JsonLikeObject";

export default abstract class NanoService<T> extends NodeBase {
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
		const defaultMeter = metrics.getMeter("default");

		try {
			const globalMetrics = new Metrics();
			globalMetrics.start();
			const response: ResponseContext = { success: true, data: {}, error: null };

			const start = performance.now();
			ctx.logger.log(`Running node: ${this.name} [${JSON.stringify(this.originalConfig)}]`);

			const node_execution = defaultMeter.createCounter("node", {
				description: "Node requests",
			});

			const node_time = defaultMeter.createGauge("node_time", {
				description: "Node elapsed time",
			});

			const node_mem = defaultMeter.createGauge("node_memory", {
				description: "Node memory usage",
			});

			const node_mem_average = defaultMeter.createGauge("node_memory_average", {
				description: "Node memory average",
			});

			const node_memory_usage_min = defaultMeter.createGauge("node_memory_usage_min", {
				description: "Node memory usage min",
			});

			const node_memory_total = defaultMeter.createGauge("node_memory_total", {
				description: "Node memory total",
			});

			const node_memory_free = defaultMeter.createGauge("node_memory_free", {
				description: "Node memory free",
			});

			const node_cpu = defaultMeter.createGauge("node_cpu", {
				description: "Node cpu usage",
			});

			const node_cpu_average = defaultMeter.createGauge("node_cpu_average", {
				description: "Node cpu average",
			});

			const node_cpu_total = defaultMeter.createGauge("node_cpu_total", {
				description: "Node cpu total",
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
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_time.record(end - start, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			ctx.logger.log(`Executed node: ${this.name} in ${(end - start).toFixed(2)}ms`);

			if (this.set_var) {
				const vars = {
					[this.name]: (result as unknown as JsonLikeObject).data,
				};
				this.setVar(ctx, vars as unknown as VarsContext);
				response.data = ctx.response || {};
			} else {
				response.data = result;
				(response.data as unknown as NanoService<T>).contentType = this.contentType;
			}

			globalMetrics.retry();
			globalMetrics.stop();
			const average = await globalMetrics.getMetrics();

			node_mem.record(average.memory.max, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_mem_average.record(average.memory.total, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_memory_usage_min.record(average.memory.min, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_memory_total.record(average.memory.global_memory, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_memory_free.record(average.memory.global_free_memory, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_cpu.record(average.cpu.usage, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_cpu_average.record(average.cpu.average, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			node_cpu_total.record(average.cpu.total, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			globalMetrics.clear();

			return response;
		} catch (e: unknown) {
			const node_errors = defaultMeter.createCounter("node_errors", {
				description: "Node errors",
			});

			node_errors.add(1, {
				env: process.env.NODE_ENV,
				workflow_path: `${ctx.workflow_path}`,
				workflow_name: `${ctx.workflow_name}`,
				node_name: `${this.name}`,
				node: (this as unknown as RunnerNode).node,
			});

			throw e;
		}
	}

	public abstract handle(
		ctx: Context,
		inputs: T | JsonLikeObject | Condition[],
	): Promise<INanoServiceResponse | NanoService<T>[]>;

	public async validate(obj: JsonLikeObject, schema: Schema): Promise<void> {
		const result = this.v.validate(obj, schema);
		if (result.valid === false) {
			const errors: string[] = [];
			for (let i = 0; i < result.errors.length; i++) {
				const error: ValidationError = result.errors[i];
				errors.push(`${error.property} ${error.message}`);
			}
			throw new Error(errors.join(", "));
		}
	}
}
