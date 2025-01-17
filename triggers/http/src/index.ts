import { env } from "node:process";
import { type Span, metrics, trace } from "@opentelemetry/api";
import HttpTrigger from "./HttpTrigger";

class Main {
	private httpTrigger: HttpTrigger = <HttpTrigger>{};
	protected trigger_initializer = 0;
	protected initializer = 0;
	protected tracer = trace.getTracer("trigger-http-server", "0.0.8");
	protected app_cold_start = metrics.getMeter("default").createGauge("initialization", {
		description: "Application cold start",
	});

	constructor() {
		this.initializer = performance.now();
		this.httpTrigger = new HttpTrigger();
	}

	async run() {
		this.tracer.startActiveSpan("initialization", async (span: Span) => {
			await this.httpTrigger.listen();
			this.initializer = performance.now() - this.initializer;

			console.log(`HttpTrigger initialized in ${(this.initializer).toFixed(2)}ms`);
			this.app_cold_start.record(this.initializer, { pid: process.pid, env: env.NODE_ENV });
			span.end();
		});
	}

	getHttpApp() {
		return this.httpTrigger.getApp();
	}
}

const main = new Main();
main.run();

export const api = main.getHttpApp();
