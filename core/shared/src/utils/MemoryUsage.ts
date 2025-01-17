import os from "node:os";
import MetricsBase, { type MemoryUsageType } from "./MetricsBase";

export default class MemoryUsage extends MetricsBase {
	public usages: number[] = [];
	public timer: NodeJS.Timeout | undefined;

	constructor() {
		super();
		this.timer = undefined;
	}

	public async start(ms?: number) {
		this.timer = await setInterval(async () => {
			let usage = 0;
			usage = process.memoryUsage().heapUsed;

			this.usages.push(usage / 1000000);
		}, ms || 5);
	}

	public async stop() {
		setTimeout(() => {
			clearInterval(this.timer);
		}, 10);
	}

	public async getUsages(): Promise<number[]> {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(this.usages);
			}, 20);
		});
	}

	public async getMetrics(): Promise<MemoryUsageType> {
		return new Promise((resolve) => {
			setTimeout(() => {
				let total = 0;
				for (let i = 0; i < this.usages.length; i++) {
					total += this.usages[i];
				}

				const max = Math.max(...this.usages);
				const min = Math.min(...this.usages);

				resolve({
					total: total / this.usages.length,
					min: min,
					max: max,
					global_memory: os.totalmem() / 1000000,
					global_free_memory: os.freemem() / 1000000,
				});
			}, 20);
		});
	}

	public clear(): void {
		this.usages = [];
	}
}
