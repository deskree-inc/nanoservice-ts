import dayjs from "dayjs";
import Metrics, { type TimeUsageType } from "./MetricsBase";

export default class Time extends Metrics {
	private startTime: string | null = null;
	private endTime: string | null = null;
	private performanceStart = 0;
	private performanceEnd = 0;

	public async start() {
		this.startTime = dayjs().format();
		this.performanceStart = performance.now();
	}

	public async stop() {
		this.endTime = dayjs().format();
		this.performanceEnd = performance.now();
	}

	public async getMetrics() {
		return {
			startTime: this.startTime,
			endTime: this.endTime,
			duration: this.performanceEnd - this.performanceStart,
		} as TimeUsageType;
	}
}
