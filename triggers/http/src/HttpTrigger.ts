import type { GlobalOptions, TriggerResponse } from "@nanoservice-ts/runner";
import { TriggerBase } from "@nanoservice-ts/runner";
import { NodeMap } from "@nanoservice-ts/runner";
import { DefaultLogger } from "@nanoservice-ts/runner";
import { type Context, GlobalError, type RequestContext } from "@nanoservice-ts/shared";
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
	protected tracer = trace.getTracer(
		process.env.PROJECT_NAME || "trigger-http-workflow",
		process.env.PROJECT_VERSION || "0.0.1",
	);
	private logger = new DefaultLogger();

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
			this.app.use(express.static("public"));
			this.app.use(bodyParser.text({ limit: "150mb" }));
			this.app.use(bodyParser.urlencoded({ extended: true }));
			this.app.use(bodyParser.json({ limit: "150mb" }));
			this.app.use(cors());

			this.app.use("/health-check", (req: Request, res: Response) => {
				res.status(200).send("Online and ready for action 💪");
			});

			this.app.use(["/:workflow", "/"], async (req: Request, res: Response): Promise<void> => {
				const id: string = (req.query?.requestId as string) || (uuid() as string);
				req.query.requestId = undefined;
				const blueprintNameInPath: string = req.params.workflow;

				const defaultMeter = metrics.getMeter("default");
				const workflow_runner_errors = defaultMeter.createCounter("workflow_errors", {
					description: "Workflow runner errors",
				});

				await this.tracer.startActiveSpan(`${blueprintNameInPath}`, async (span: Span) => {
					try {
						const start = performance.now();

						await this.configuration.init(blueprintNameInPath, this.nodeMap);
						let ctx: Context = this.createContext(undefined, blueprintNameInPath || req.params.blueprint, id);
						req.params = handleDynamicRoute(this.configuration.trigger.http.path, req);

						ctx.logger.log(`Version: ${this.configuration.version}, Method: ${req.method}`);

						const { method, path } = this.configuration.trigger.http;
						if (method && method !== "*" && req.method.toLowerCase() !== method.toLowerCase())
							throw new Error("Invalid HTTP method");
						if (!validateRoute(path, req.path)) throw new Error("Invalid HTTP path");

						ctx.request = req as unknown as RequestContext;
						const response: TriggerResponse = await this.run(ctx);
						ctx = response.ctx;
						const average = response.metrics;

						const end = performance.now();
						ctx.logger.log(`Completed in ${(end - start).toFixed(2)}ms`);

						if (ctx.response.contentType === undefined || ctx.response.contentType === "")
							ctx.response.contentType = "application/json";

						span.setAttribute("success", true);
						span.setAttribute("Content-Type", ctx.response.contentType);
						span.setAttribute("workflow_request_id", `${ctx.id}`);
						span.setAttribute("workflow_elapsed_time", `${end - start}`);
						span.setAttribute("workflow_version", `${this.configuration.version}`);
						span.setAttribute("workflow_name", `${this.configuration.name}`);
						span.setAttribute("workflow_memory_avg_mb", `${average.memory.total}`);
						span.setAttribute("workflow_memory_min_mb", `${average.memory.min}`);
						span.setAttribute("workflow_memory_max_mb", `${average.memory.max}`);
						span.setAttribute("workflow_cpu_percentage", `${average.cpu.average}`);
						span.setAttribute("workflow_cpu_total", `${average.cpu.total}`);
						span.setAttribute("workflow_cpu_usage", `${average.cpu.usage}`);
						span.setAttribute("workflow_cpu_model", `${average.cpu.model}`);
						span.setStatus({ code: SpanStatusCode.OK });

						res.setHeader("Content-Type", ctx.response.contentType);
						res.status(200).send(ctx.response.data);
					} catch (e: unknown) {
						span.setAttribute("success", false);
						span.setAttribute("workflow_request_id", `${id}`);
						span.recordException(e as Error);

						if (e instanceof GlobalError) {
							const error_context = e as GlobalError;

							if (error_context.context.message === "{}" && error_context.context.json instanceof DOMException) {
								workflow_runner_errors.add(1, {
									env: process.env.NODE_ENV,
									workflow_version: `${this.configuration.version || "unknown"}`,
									workflow_name: `${blueprintNameInPath || this.configuration.name}`,
								});
								span.setStatus({
									code: SpanStatusCode.ERROR,
									message: (error_context.context.json as Error).toString(),
								});
								res.status(500).json({
									origin: error_context.context.name,
									error: (error_context.context.json as Error).toString(),
								});

								this.logger.error(`${(error_context.context.json as Error).toString()}`);
							} else {
								if (error_context.context.code === undefined) error_context.setCode(500);
								const code = error_context.context.code as number;

								if (error_context.hasJson()) {
									workflow_runner_errors.add(1, {
										env: process.env.NODE_ENV,
										workflow_version: `${this.configuration.version || "unknown"}`,
										workflow_name: `${blueprintNameInPath || this.configuration.name}`,
									});
									span.setStatus({ code: SpanStatusCode.ERROR, message: JSON.stringify(error_context.context.json) });
									this.logger.error(`${JSON.stringify(error_context.context.json)}`);
									res.status(code).json(error_context.context.json);
								} else {
									workflow_runner_errors.add(1, {
										env: process.env.NODE_ENV,
										workflow_version: `${this.configuration.version || "unknown"}`,
										workflow_name: `${blueprintNameInPath || this.configuration.name}`,
									});
									span.setStatus({ code: SpanStatusCode.ERROR, message: error_context.message });
									this.logger.error(`${error_context.message}`, error_context.stack?.replace(/\n/g, " "));
									res.status(code).json({ error: error_context.message });
								}
							}
						} else {
							workflow_runner_errors.add(1, {
								env: process.env.NODE_ENV,
								workflow_version: `${this.configuration.version || "unknown"}`,
								workflow_name: `${blueprintNameInPath || this.configuration.name}`,
							});
							span.setStatus({ code: SpanStatusCode.ERROR, message: (e as Error).message });
							this.logger.error(`${(e as Error).message}`, `${(e as Error).stack?.replace(/\n/g, " ")}`);
							res.status(500).json({ error: (e as Error).message });
						}
					} finally {
						span.end();
					}
				});
			});

			this.app.listen(this.port, () => {
				this.logger.log(`Server is running at http://localhost:${this.port}`);
				done(this.endCounter(this.initializer));
			});
		});
	}
}
