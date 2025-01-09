import os from "node:os";
import type Average from "./types/Average";

export default class MemoryUsage {
	public usages: number[] = [];
	public timer: NodeJS.Timeout | undefined;

	constructor() {
		this.timer = undefined;
	}

	public async start() {
		this.timer = await setInterval(async () => {
			const usage = process.memoryUsage().heapUsed;
			this.usages.push(usage / 1000000);
		}, 5);
	}

	public stop(): void {
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

	public async getAverage(): Promise<Average> {
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
