import { type BlueprintContext, BlueprintError } from "@deskree/blueprint-shared";
import bodyParser from "body-parser";
import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import { type GlobalOptions, NodeMap } from "nanoservice-ts-runner";
import TriggerBase from "nanoservice-ts-runner/src/TriggerBase";
import { v4 as uuid } from "uuid";
import MemoryUsage from "./MemoryUsage";
import nodes from "./Nodes";
import { handleDynamicRoute, validateRoute } from "./Util";

export default class HttpTrigger extends TriggerBase {
	private app: Express = express();
	private port: string | number = process.env.PORT || 4000;
	private initializer = 0;
	private nodeMap: GlobalOptions = <GlobalOptions>{};

	constructor() {
		super();

		this.initializer = this.startCounter();
		this.loadNodes();
	}

	loadNodes() {
		this.nodeMap.nodes = new NodeMap();
		const nodeKeys = Object.keys(nodes);
		for (const key of nodeKeys) {
			this.nodeMap.nodes.addNode(key, nodes[key]);
		}
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

				try {
					const memoryUsage = new MemoryUsage();
					memoryUsage.start();
					const start = performance.now();

					await this.configuration.init(blueprintNameInPath, this.nodeMap);

					let ctx: BlueprintContext = this.createContext(undefined, blueprintNameInPath || req.params.blueprint, id);
					req.params = handleDynamicRoute(this.configuration.trigger.http.path, req);

					ctx.logger.log(`Blueprint name: "${this.configuration.name}", version: "${this.configuration.version}"`);

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

					res.setHeader("Content-Type", ctx.response.contentType);
					res.setHeader("workflow_runner_id", `${ctx.id}`);
					res.setHeader("workflow_runner_time", `${end - start}`);
					res.setHeader("workflow_runner_version", `${this.configuration.version}`);
					res.setHeader("workflow_runner_name", `${this.configuration.name}`);
					res.setHeader("workflow_runner_memory_avg_mb", `${average.total}`);
					res.setHeader("workflow_runner_memory_min_mb", `${average.min}`);
					res.setHeader("workflow_runner_memory_max_mb", `${average.max}`);

					res.status(200).send(ctx.response.data);
				} catch (e: unknown) {
					res.setHeader("blueprint_runner_id", `${id}`);
					if (e instanceof BlueprintError) {
						const error_context = e as BlueprintError;
						if (error_context.context.code === undefined) error_context.setCode(500);
						const code = error_context.context.code as number;

						if (error_context.hasJson()) {
							res.status(code).json(error_context.context.json);
						} else {
							console.log("error_context", error_context);
							res.status(code).json({ error: error_context.message });
						}
					} else {
						res.status(500).json({ error: (e as Error).message });
					}
				}
			});

			this.app.listen(this.port, () => {
				console.log(`HttpTrigger is running at http://localhost:${this.port}`);
				done(this.endCounter(this.initializer));
			});
		});
	}
}
