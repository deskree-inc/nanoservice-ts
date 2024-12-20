import { MemoryUsage } from "@nanoservice/runner";
import HttpTrigger from "./HttpTrigger";

class Main {
	private httpTrigger: HttpTrigger = <HttpTrigger>{};
	protected memoryUsage: MemoryUsage;
	protected trigger_initializer = 0;
	protected initializer = 0;

	constructor() {
		this.httpTrigger = new HttpTrigger();
		this.memoryUsage = new MemoryUsage();
		this.initializer = performance.now();
	}

	async run() {
		this.trigger_initializer = await this.httpTrigger.listen();
		this.initializer = performance.now() - this.initializer + this.trigger_initializer;

		console.log(`Runner initialized in ${(this.initializer).toFixed(2)}ms`);

		const mem_usage = process.env.SHOW_MEMORY_USAGE || "false";
		if (mem_usage === "true") {
			this.memoryUsage.start();
			setInterval(() => {
				this.memoryUsage.getAverage().then((average) => {
					console.log(
						`Node Mem: ${(average.total).toFixed(2)} MB, Host Mem: ${(average.global_memory).toFixed(2)} MB, Host Free Mem: ${(average.global_free_memory).toFixed(2)} MB`,
					);
					this.memoryUsage.clear();
				});
			}, 1000);
		}
	}

	getHttpApp() {
		return this.httpTrigger.getApp();
	}
}

const main = new Main();
main.run();

export const api = main.getHttpApp();
