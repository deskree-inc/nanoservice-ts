import { DefaultLogger } from "@blok-ts/runner";
import type { ConnectRouter } from "@connectrpc/connect";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { type Span, metrics, trace } from "@opentelemetry/api";
import GRpcTrigger from "./GRpcTrigger";

export type GrpcServerOptions = {
	host: string;
	port: number;
};

export default class GrpcServer {
	protected opts: GrpcServerOptions;
	protected tracer = trace.getTracer(
		process.env.PROJECT_NAME || "trigger-grpc-server",
		process.env.PROJECT_VERSION || "0.0.1",
	);
	protected app_cold_start = metrics.getMeter("default").createGauge("initialization", {
		description: "Application cold start",
	});
	protected initializer = 0;
	protected logger = new DefaultLogger();

	constructor(opts: GrpcServerOptions) {
		this.opts = opts;

		if (this.opts.host === undefined) {
			this.opts.host = "0.0.0.0";
		}

		if (this.opts.port === undefined) {
			this.opts.port = 8443;
		}

		this.initializer = performance.now();
	}

	async start() {
		this.tracer.startActiveSpan("initialization", async (span: Span) => {
			const trigger = new GRpcTrigger();
			const server = trigger.getApp();
			const host = process.env.GRPC_HOST || this.opts.host;
			let port: string | number = process.env.GRPC_PORT || this.opts.port;
			if (typeof port === "string") {
				port = Number.parseInt(port, 10);
			}
			await server.register(fastifyConnectPlugin, {
				routes: (router: ConnectRouter) => trigger.processRequest(router, trigger),
			});
			await server.listen({ host, port: port });
			this.logger.log(`Server is listening at ${JSON.stringify(server.addresses())}`);

			this.initializer = performance.now() - this.initializer;
			this.logger.log(`Server initialized in ${(this.initializer).toFixed(2)}ms`);
			this.app_cold_start.record(this.initializer, {
				pid: process.pid,
				env: process.env.NODE_ENV,
				app: process.env.APP_NAME,
			});
			span.end();
		});
	}
}
