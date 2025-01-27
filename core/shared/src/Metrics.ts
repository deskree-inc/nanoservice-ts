import { CpuUsage, Time } from "./utils";
import MemoryUsage from "./utils/MemoryUsage";
import type { CpuUsageType, MemoryUsageType, TimeUsageType } from "./utils/MetricsBase";

class Metrics {
	private cpuUsage: CpuUsage;
	private memoryUsage: MemoryUsage;
	private time: Time;

	constructor() {
		this.cpuUsage = new CpuUsage();
		this.memoryUsage = new MemoryUsage();
		this.time = new Time();
	}

	public start() {
		this.cpuUsage.start();
		this.memoryUsage.start();
		this.time.start();
	}

	public retry() {
		this.memoryUsage.start();
	}

	public stop() {
		this.cpuUsage.stop();
		this.time.stop();
		this.memoryUsage.stop();
	}

	public clear() {
		this.memoryUsage.clear();
	}

	public getMetrics(): MetricsType {
		const cpu = this.cpuUsage.getMetrics();
		const memory = this.memoryUsage.getMetrics();
		const time = this.time.getMetrics();

		return {
			cpu,
			memory: memory,
			time,
		};
	}
}

type MetricsType = {
	cpu: CpuUsageType;
	memory: MemoryUsageType;
	time: TimeUsageType;
};

export { Metrics, type MetricsType };
