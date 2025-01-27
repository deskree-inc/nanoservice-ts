export default abstract class MetricsBase {
	public abstract start(ms?: number): void;
	public abstract stop(): void;
	public abstract getMetrics(): MemoryUsageType | TimeUsageType | CpuUsageType;
}

type MemoryUsageType = {
	total: number;
	min: number;
	max: number;
	global_memory: number;
	global_free_memory: number;
};

type TimeUsageType = {
	startTime: string;
	endTime: string;
	duration: number;
};

type CpuUsageType = {
	average: number;
	total: number;
	model: string;
	usage: number;
};

export type { MemoryUsageType, TimeUsageType, CpuUsageType };
