// @ts-ignore
import os from "node:os";
import MetricsBase from "./MetricsBase";

export default class MemoryUsage extends MetricsBase {
	protected min_val = 0;
	protected max_val = 0;
	protected total_val = 0;
	protected counter = 0;

	public start(): void {
		const usage = process.memoryUsage().heapUsed;
		const val = usage / 1000000;

		this.total_val += val;

		if (this.min_val === 0) this.min_val = val;
		this.min_val = this.min_val > val ? val : this.min_val;
		this.max_val = this.max_val < val ? val : this.max_val;

		this.counter++;
	}

	public stop() {}

	public getMetrics() {
		return {
			total: this.total_val / this.counter,
			min: this.min_val,
			max: this.max_val,
			global_memory: os.totalmem() / 1000000,
			global_free_memory: os.freemem() / 1000000,
		};
	}

	public clear(): void {
		this.total_val = 0;
		this.min_val = 0;
		this.max_val = 0;
		this.counter = 0;
	}
}
