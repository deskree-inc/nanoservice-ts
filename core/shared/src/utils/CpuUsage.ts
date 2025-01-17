import os, { type CpuInfo } from "node:os";
import Metrics, { type CpuUsageType } from "./MetricsBase";

export default class CpuMetrics extends Metrics {
	private numCPUs = 0;
	private cpuModel = "";
	private startUsage: MeasureCpuType = <MeasureCpuType>{};
	private endUsage: MeasureCpuType = <MeasureCpuType>{};

	public async start() {
		const cpus = os.cpus();
		this.cpuModel = cpus[0].model;
		this.numCPUs = cpus.length;
		this.startUsage = this.measureCpu();
	}

	public async stop() {
		this.endUsage = this.measureCpu();
	}

	getAverage() {
		const idleDifference = this.endUsage.idle - this.startUsage.idle;
		const totalDifference = this.endUsage.total - this.startUsage.total;
		const percentageCpu = 100 - (100 * idleDifference) / totalDifference;

		return percentageCpu;
	}

	public async getMetrics() {
		const average = this.getAverage();
		const usage = (average * this.numCPUs) / 100;
		return {
			total: this.numCPUs,
			average: average,
			usage: usage,
			model: this.cpuModel,
		} as CpuUsageType;
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
