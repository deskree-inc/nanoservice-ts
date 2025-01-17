import { type BlueprintContext, BlueprintError } from "@deskree/blueprint-shared";
import { type GlobalOptions, MemoryUsage } from "@nanoservice-ts/runner";
import { TriggerBase } from "@nanoservice-ts/runner";
import { NodeMap } from "@nanoservice-ts/runner";
import { type Span, SpanStatusCode, metrics, trace } from "@opentelemetry/api";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { v4 as uuid } from "uuid";
import nodes from "./Nodes";
import { handleDynamicRoute, validateRoute } from "./Util";
import workflows from "./Workflows";

export default class HttpTrigger extends TriggerBase {
	private app: Express = express();
	private port: string | number = process.env.PORT || 4000;
	private initializer = 0;
	private nodeMap: GlobalOptions = <GlobalOptions>{};
	protected tracer = trace.getTracer("trigger-http-workflow", "0.0.1");

	constructor() {
		super();

		this.initializer = this.startCounter();
		this.loadNodes();
		this.loadWorkflows();
	}

	loadNodes() {
		this.nodeMap.nodes = new NodeMap();
		const nodeKeys = Object.keys(nodes);
		for (const key of nodeKeys) {
			this.nodeMap.nodes.addNode(key, nodes[key]);
		}
	}

	loadWorkflows() {
		this.nodeMap.workflows = workflows;
	}

	getApp(): Express {
		return this.app;
	}

	listen(): Promise<number> {
		return new Promise((done) => {
			this.app.use(bodyParser.text({ limit: "150mb" }));
			this.app.use(bodyParser.urlencoded({ extended: true }));
			this.app.use(bodyParser.json({ limit: "150mb" }));
			this.app.use(cors());

			this.app.use(["/:blueprint", "/"], async (req: Request, res: Response): Promise<void> => {
				const id: string = (req.query?.requestId as string) || (uuid() as string);
				req.query.requestId = undefined;
				const blueprintNameInPath: string = req.params.blueprint;

				const workflow_execution = metrics.getMeter("default").createCounter(`workflow:${blueprintNameInPath}`, {
					description: "Workflow execution",
				});

				const workflow_runner_time = metrics.getMeter("default").createGauge(`workflow:${blueprintNameInPath}:time`, {
					description: "Workflow runner elapsed time",
				});

				const workflow_runner_mem = metrics.getMeter("default").createGauge(`workflow:${blueprintNameInPath}:memory`, {
					description: "Workflow runner memory usage",
				});

				const workflow_runner_cpu = metrics.getMeter("default").createGauge(`workflow:${blueprintNameInPath}:cpu`, {
					description: "Workflow runner cpu usage",
				});

				this.tracer.startActiveSpan(`${blueprintNameInPath}`, async (span: Span) => {
					try {
						const memoryUsage = new MemoryUsage();
						memoryUsage.start();
						const start = performance.now();

						await this.configuration.init(blueprintNameInPath, this.nodeMap);

						let ctx: BlueprintContext = this.createContext(undefined, blueprintNameInPath || req.params.blueprint, id);
						req.params = handleDynamicRoute(this.configuration.trigger.http.path, req);

						ctx.logger.log(`Workflow name: "${this.configuration.name}", version: "${this.configuration.version}"`);

						const { method, path } = this.configuration.trigger.http;

						if (method && req.method.toLowerCase() !== method.toLowerCase()) throw new Error("Invalid HTTP method");
						if (!validateRoute(path, req.path)) throw new Error("Invalid HTTP path");

						ctx.request = req;
						ctx = await this.run(ctx);

						memoryUsage.stop();
						const average = await memoryUsage.getAverage();
						ctx.logger.log(
							`Memory average: ${average.total.toFixed(2)}MB, min: ${average.min.toFixed(2)}MB, max: ${average.max.toFixed(2)}MB`,
						);
						memoryUsage.clear();

						const end = performance.now();
						ctx.logger.log(`Workflow Runner completed in ${(end - start).toFixed(2)}ms`);

						if (ctx.response.contentType === undefined || ctx.response.contentType === "")
							ctx.response.contentType = "application/json";

						span.setAttribute("success", true);
						span.setAttribute("Content-Type", ctx.response.contentType);
						span.setAttribute("workflow_request_id", `${ctx.id}`);
						span.setAttribute("workflow_elapsed_time", `${end - start}`);
						span.setAttribute("workflow_version", `${this.configuration.version}`);
						span.setAttribute("workflow_name", `${this.configuration.name}`);
						span.setAttribute("workflow_memory_avg_mb", `${average.total}`);
						span.setAttribute("workflow_memory_min_mb", `${average.min}`);
						span.setAttribute("workflow_memory_max_mb", `${average.max}`);
						span.setAttribute("workflow_cpu_percentage", `${average.cpu_percentage}`);
						span.setAttribute("workflow_cpu_total", `${average.cpu_total}`);
						span.setAttribute("workflow_cpu_usage", `${average.cpu_usage}`);
						span.setAttribute("workflow_cpu_model", `${memoryUsage.cpu_model}`);
						span.setStatus({ code: SpanStatusCode.OK });

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

						workflow_runner_mem.record(average.max, {
							pid: process.pid,
							env: process.env.NODE_ENV,
							workflow_request_id: `${ctx.id}`,
							workflow_version: `${this.configuration.version}`,
							workflow_name: `${this.configuration.name}`,
							average: average.total,
							min: average.min,
						});

						workflow_runner_cpu.record(average.cpu_usage, {
							pid: process.pid,
							env: process.env.NODE_ENV,
							workflow_request_id: `${ctx.id}`,
							workflow_version: `${this.configuration.version}`,
							workflow_name: `${this.configuration.name}`,
							cpu_percentage: average.cpu_percentage,
							cpu_total: average.cpu_total,
							cpu_model: memoryUsage.cpu_model,
						});

						res.setHeader("Content-Type", ctx.response.contentType);
						res.status(200).send(ctx.response.data);
					} catch (e: unknown) {
						span.setAttribute("success", false);
						span.setAttribute("workflow_request_id", `${id}`);
						span.recordException(e as Error);

						if (e instanceof BlueprintError) {
							const error_context = e as BlueprintError;

							if (error_context.context.message === "{}" && error_context.context.json instanceof DOMException) {
								span.setStatus({
									code: SpanStatusCode.ERROR,
									message: (error_context.context.json as Error).toString(),
								});
								res.status(500).json({
									origin: error_context.context.name,
									error: (error_context.context.json as Error).toString(),
								});
							} else {
								if (error_context.context.code === undefined) error_context.setCode(500);
								const code = error_context.context.code as number;

								if (error_context.hasJson()) {
									span.setStatus({ code: SpanStatusCode.ERROR, message: JSON.stringify(error_context.context.json) });
									res.status(code).json(error_context.context.json);
								} else {
									span.setStatus({ code: SpanStatusCode.ERROR, message: error_context.message });
									res.status(code).json({ error: error_context.message });
								}
							}
						} else {
							span.setStatus({ code: SpanStatusCode.ERROR, message: (e as Error).message });
							res.status(500).json({ error: (e as Error).message });
						}
					} finally {
						span.end();
					}
				});
			});

			this.app.listen(this.port, () => {
				console.log(`HttpTrigger is running at http://localhost:${this.port}`);
				done(this.endCounter(this.initializer));
			});
		});
	}
}
