import os, { type CpuInfo } from "node:os";
import type Average from "./types/Average";

export default class MemoryUsage {
	public usages: number[] = [];
	protected cpuUsages: number[] = [];
	public timer: NodeJS.Timeout | undefined;
	protected cpuStartMeasure: MeasureCpuType = <MeasureCpuType>{};
	public cpu_model = "";

	constructor() {
		this.timer = undefined;
		this.cpuUsages = [];
	}

	public async start() {
		this.cpuStartMeasure = this.measureCpu();
		this.timer = await setInterval(async () => {
			const usage = process.memoryUsage().heapUsed;
			this.usages.push(usage / 1000000);

			const endMeasure = this.measureCpu();
			const idleDifference = endMeasure.idle - this.cpuStartMeasure.idle;
			const totalDifference = endMeasure.total - this.cpuStartMeasure.total;
			const percentageCpu = 100 - (100 * idleDifference) / totalDifference;

			this.cpuUsages.push(percentageCpu);
			this.cpu_model = endMeasure.model;
		}, 1);
	}

	public stop(): void {
		clearInterval(this.timer);
	}

	public async getUsages(): Promise<number[]> {
		return new Promise((resolve) => {
			resolve(this.usages);
		});
	}

	public async getAverage(): Promise<Average> {
		return new Promise((resolve) => {
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
				cpu_percentage: Math.max(...this.cpuUsages),
				cpu_total: os.cpus().length,
				cpu_usage: (Math.max(...this.cpuUsages) * os.cpus().length) / 100,
			});
		});
	}

	public clear(): void {
		this.usages = [];
		this.cpuUsages = [];

		if (global.gc) {
			global.gc();
		}
	}

	public measureCpu(): MeasureCpuType {
		const cpus: CpuInfo[] = os.cpus();

		let idleMs = 0;
		let totalMs = 0;
		const total = cpus.length;

		for (let i = 0, len = cpus.length; i < len; i++) {
			const cpu = cpus[i];

			totalMs += cpu.times.idle;
			totalMs += cpu.times.irq;
			totalMs += cpu.times.nice;
			totalMs += cpu.times.sys;
			totalMs += cpu.times.user;

			idleMs += cpu.times.idle;
		}

		return {
			idle: idleMs / cpus.length,
			total: totalMs / cpus.length,
			model: cpus[0].model,
			cpus: total,
		};
	}
}

type MeasureCpuType = {
	idle: number;
	total: number;
	model: string;
	cpus: number;
};
