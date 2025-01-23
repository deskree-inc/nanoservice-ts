import { type Context, type LoggerContext, Metrics, Trigger } from "@nanoservice-ts/shared";
import { metrics } from "@opentelemetry/api";
import { v4 as uuid } from "uuid";
import Configuration from "./Configuration";
import DefaultLogger from "./DefaultLogger";
import Runner from "./Runner";
import type TriggerResponse from "./types/TriggerResponse";

export default abstract class TriggerBase extends Trigger {
	public configuration: Configuration;

	constructor() {
		super();
		this.configuration = new Configuration();
	}

	abstract listen(): Promise<number>;

	getConfiguration(): Configuration {
		return new Configuration();
	}

	getRunner(): Runner {
		return new Runner(this.configuration.steps);
	}

	async run(ctx: Context): Promise<TriggerResponse> {
		const start = performance.now();
		const defaultMeter = metrics.getMeter("default");
		const workflow_execution = defaultMeter.createCounter(`workflow:${ctx.workflow_path}`, {
			description: "Workflow requests",
		});

		const workflow_runner_time = defaultMeter.createGauge(`workflow:${ctx.workflow_path}:time`, {
			description: "Workflow runner elapsed time",
		});

		const workflow_runner_mem = defaultMeter.createGauge(`workflow:${ctx.workflow_path}:memory`, {
			description: "Workflow runner memory usage",
		});

		const workflow_runner_cpu = defaultMeter.createGauge(`workflow:${ctx.workflow_path}:cpu`, {
			description: "Workflow runner cpu usage",
		});

		try {
			const globalMetrics = new Metrics();
			globalMetrics.start();

			const runner: Runner = this.getRunner();
			const context = await runner.run(ctx);
			globalMetrics.retry();
			globalMetrics.stop();
			const average = await globalMetrics.getMetrics();
			const end = performance.now();

			ctx.logger.log(
				`Memory average: ${average.memory.total.toFixed(2)}MB, min: ${average.memory.min.toFixed(2)}MB, max: ${average.memory.max.toFixed(2)}MB`,
			);
			globalMetrics.clear();
			workflow_execution.add(1, {
				pid: process.pid,
				env: process.env.NODE_ENV,
				workflow_request_id: `${ctx.id}`,
				workflow_runner_version: `${this.configuration.version}`,
				workflow_runner_name: `${this.configuration.name}`,
			});

			workflow_runner_time.record(end - start, {
				pid: process.pid,
				env: process.env.NODE_ENV,
				workflow_request_id: `${ctx.id}`,
				workflow_version: `${this.configuration.version}`,
				workflow_name: `${this.configuration.name}`,
			});

			workflow_runner_mem.record(average.memory.max, {
				pid: process.pid,
				env: process.env.NODE_ENV,
				workflow_request_id: `${ctx.id}`,
				workflow_version: `${this.configuration.version}`,
				workflow_name: `${this.configuration.name}`,
				average: average.memory.total,
				min: average.memory.min,
			});

			workflow_runner_cpu.record(average.cpu.usage, {
				pid: process.pid,
				env: process.env.NODE_ENV,
				workflow_request_id: `${ctx.id}`,
				workflow_version: `${this.configuration.version}`,
				workflow_name: `${this.configuration.name}`,
				cpu_percentage: average.cpu.average,
				cpu_total: average.cpu.total,
				cpu_model: average.cpu.model,
			});

			return {
				ctx: context,
				metrics: average,
			};
		} catch (e: unknown) {
			console.log(e);
			throw e;
		}
	}

	createContext(logger?: LoggerContext, blueprintName?: string, id?: string): Context {
		const requestId: string = id || uuid();
		const ctx: Context = {
			id: requestId,
			workflow_name: this.configuration.name,
			workflow_path: blueprintName || "",
			config: this.configuration.nodes,
			request: { body: {} },
			response: { data: "", contentType: "", success: true, error: null },
			error: { message: [] },
			logger: logger || new DefaultLogger(blueprintName, requestId),
			eventLogger: null,
			_PRIVATE_: null,
		};

		Object.defineProperty(ctx, "id", {
			value: requestId,
			enumerable: true,
		});

		Object.defineProperty(ctx, "env", {
			value: process.env,
			enumerable: true,
		});

		return ctx;
	}

	startCounter() {
		return performance.now();
	}

	endCounter(start: number) {
		return performance.now() - start;
	}
}
