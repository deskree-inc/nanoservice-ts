import { CpuUsage, MemoryUsage, Time } from "./utils";
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

	public async start() {
		this.cpuUsage.start();
		this.memoryUsage.start();
		this.time.start();
	}

	public async stop() {
		this.cpuUsage.stop();
		this.time.stop();
		await this.memoryUsage.stop();
	}

	public async clear() {
		this.memoryUsage.clear();
	}

	public async getMetrics(): Promise<MetricsType> {
		const cpu = await this.cpuUsage.getMetrics();
		const memory = await this.memoryUsage.getMetrics();
		const time = await this.time.getMetrics();

		return {
			cpu,
			memory,
			time,
		};
	}
}

type MetricsType = {
	cpu: CpuUsageType;
	memory: MemoryUsageType;
	time: TimeUsageType;
};

export default new Metrics();
export { Metrics, type MetricsType };
