import type { ConnectRouter } from "@connectrpc/connect";
import {
	DefaultLogger,
	type GlobalOptions,
	NodeMap,
	type ParamsDictionary,
	TriggerBase,
	type TriggerResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { type Span, SpanStatusCode, metrics, trace } from "@opentelemetry/api";
import fastify from "fastify";
import { v4 as uuid } from "uuid";
import MessageDecode from "./MessageDecode";
import nodes from "./Nodes";
import workflows from "./Workflows";
import type RuntimeWorkflow from "./types/RuntimeWorkflow";

import { type Step, Workflow } from "@nanoservice-ts/helper";
import type { TriggerOpts } from "@nanoservice-ts/helper/dist/types/TriggerOpts";
import {
	MessageEncoding,
	MessageType,
	type WorkflowRequest,
	type WorkflowResponse,
	WorkflowService,
} from "./gen/workflow_pb";

enum NodeTypes {
	MODULE = "module",
	LOCAL = "local",
	PYTHON3 = "runtime.python3",
}

export default class GRpcTrigger extends TriggerBase {
	private server = fastify({
		http2: true,
		// https: {
		//     key: readFileSync("localhost+2-key.pem", "utf8"),
		//     cert: readFileSync("localhost+2.pem", "utf8"),
		// }
	});
	private nodeMap: GlobalOptions = <GlobalOptions>{};
	protected tracer = trace.getTracer(
		process.env.PROJECT_NAME || "trigger-grpc-workflow",
		process.env.PROJECT_VERSION || "0.0.1",
	);
	private logger = new DefaultLogger();

	constructor() {
		super();
		this.loadNodes();
		this.loadWorkflows();
	}

	getApp() {
		return this.server;
	}

	async listen(): Promise<number> {
		return 0;
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

	processRequest(router: ConnectRouter, trigger: GRpcTrigger) {
		router.service(WorkflowService, {
			executeWorkflow: (request: WorkflowRequest) => trigger.executeWorkflow(request),
		});
	}

	async executeWorkflow(request: WorkflowRequest) {
		const start = performance.now();
		const coder = new MessageDecode();
		let name = request.Name;
		const messageContext: Context = coder.requestDecode(request);
		const runtimeWorkflow = messageContext as unknown as RuntimeWorkflow;
		const id: string = (messageContext.request.query?.requestId as string) || (uuid() as string);
		let remoteNodeExecution = false;

		const defaultMeter = metrics.getMeter("default");
		const workflow_runner_errors = defaultMeter.createCounter("workflow_errors", {
			description: "Workflow runner errors",
		});

		return await this.tracer.startActiveSpan(`${name}`, async (span: Span) => {
			try {
				if (runtimeWorkflow !== undefined) {
					const workflowModel = runtimeWorkflow.workflow;
					const node_type = (workflowModel.steps[0] as unknown as ParamsDictionary).type;
					let set_node_type: NodeTypes = NodeTypes.MODULE;
					switch (node_type) {
						case "runtime.python3":
							set_node_type = NodeTypes.PYTHON3;
							break;
						case "local":
							set_node_type = NodeTypes.LOCAL;
							break;
						default:
							set_node_type = NodeTypes.MODULE;
							break;
					}

					const trigger = Object.keys(workflowModel.trigger)[0];
					const trigger_config =
						((workflowModel.trigger as unknown as ParamsDictionary)[trigger] as unknown as TriggerOpts) || {};

					const step: Step = Workflow({
						name: `Remote Node: ${name}`,
						version: "1.0.0",
						description: "Remote Node",
					})
						.addTrigger((trigger as unknown as "http") || "grpc", trigger_config)
						.addStep({
							name: "node",
							node: name,
							type: set_node_type,
							inputs: ((workflowModel.nodes as unknown as ParamsDictionary).node as unknown as ParamsDictionary).inputs,
						});

					this.nodeMap.workflows[id] = step;
					name = id;
					remoteNodeExecution = true;
				}

				await this.configuration.init(name, this.nodeMap);
				let ctx: Context = this.createContext(undefined, name, id);
				ctx.request = messageContext.request;
				ctx.logger.log(`Workflow: ${name}, Version: ${this.configuration.version}`);

				const response: TriggerResponse = await this.run(ctx);
				ctx = response.ctx;
				const average = response.metrics;

				if (ctx.response.contentType === undefined || ctx.response.contentType === "")
					ctx.response.contentType = "application/json";

				const end = performance.now();
				ctx.logger.log(`Completed in ${(end - start).toFixed(2)}ms`);

				span.setAttribute("success", true);
				span.setAttribute("Content-Type", ctx.response.contentType as string);
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

				return coder.responseEncode(ctx, request.Encoding, request.Type);
			} catch (e: unknown) {
				span.setAttribute("success", false);
				span.setAttribute("workflow_request_id", `${id}`);
				span.recordException(e as Error);
				let message: WorkflowResponse = <WorkflowResponse>{};
				const base64Key = MessageEncoding[MessageEncoding.BASE64];
				const textKey = MessageType[MessageType.TEXT];
				const jsonKey = MessageType[MessageType.JSON];

				if (e instanceof GlobalError) {
					const error_context = e as GlobalError;

					if (error_context.context.message === "{}" && error_context.context.json instanceof DOMException) {
						workflow_runner_errors.add(1, {
							env: process.env.NODE_ENV,
							workflow_version: `${this.configuration.version || "unknown"}`,
							workflow_name: `${name || this.configuration.name}`,
						});
						span.setStatus({
							code: SpanStatusCode.ERROR,
							message: (error_context.context.json as Error).toString(),
						});

						this.logger.error(`${(error_context.context.json as Error).toString()}`);
						message = {
							Message: coder.responseErrorEncode((error_context.context.json as Error).toString(), base64Key, textKey),
							Encoding: base64Key,
							Type: textKey,
						} as WorkflowResponse;
					} else {
						if (error_context.context.code === undefined) error_context.setCode(500);

						if (error_context.hasJson()) {
							workflow_runner_errors.add(1, {
								env: process.env.NODE_ENV,
								workflow_version: `${this.configuration.version || "unknown"}`,
								workflow_name: `${name || this.configuration.name}`,
							});
							span.setStatus({ code: SpanStatusCode.ERROR, message: JSON.stringify(error_context.context.json) });
							this.logger.error(`${JSON.stringify(error_context.context.json)}`);
							message = {
								Message: coder.responseErrorEncode(JSON.stringify(error_context.context.json), base64Key, textKey),
								Encoding: base64Key,
								Type: jsonKey,
							} as WorkflowResponse;
						} else {
							workflow_runner_errors.add(1, {
								env: process.env.NODE_ENV,
								workflow_version: `${this.configuration.version || "unknown"}`,
								workflow_name: `${name || this.configuration.name}`,
							});
							span.setStatus({ code: SpanStatusCode.ERROR, message: error_context.message });
							this.logger.error(`${error_context.message}`, error_context.stack?.replace(/\n/g, " "));
							message = {
								Message: coder.responseErrorEncode(error_context.message, base64Key, textKey),
								Encoding: MessageEncoding[MessageEncoding.BASE64],
								Type: textKey,
							} as WorkflowResponse;
						}
					}
				} else {
					workflow_runner_errors.add(1, {
						env: process.env.NODE_ENV,
						workflow_version: `${this.configuration.version || "unknown"}`,
						workflow_name: `${name || this.configuration.name}`,
					});
					span.setStatus({ code: SpanStatusCode.ERROR, message: (e as Error).message });
					this.logger.error(`${(e as Error).message}`, `${(e as Error).stack?.replace(/\n/g, " ")}`);

					message = {
						Message: coder.responseErrorEncode((e as Error).message, base64Key, textKey),
						Encoding: base64Key,
						Type: textKey,
					} as WorkflowResponse;
				}

				return message;
			} finally {
				if (remoteNodeExecution) {
					delete this.nodeMap.workflows[id];
				}
				span.end();
			}
		});
	}
}
