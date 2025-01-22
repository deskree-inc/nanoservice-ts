import dayjs from "dayjs";
import MetricsBase, { type TimeUsageType } from "./MetricsBase";

export default class Time extends MetricsBase {
	private startTime: string | null = null;
	private endTime: string | null = null;
	private performanceStart = 0;
	private performanceEnd = 0;

	public start() {
		this.startTime = dayjs().format();
		this.performanceStart = performance.now();
	}

	public stop() {
		this.endTime = dayjs().format();
		this.performanceEnd = performance.now();
	}

	public getMetrics() {
		return {
			startTime: this.startTime,
			endTime: this.endTime,
			duration: this.performanceEnd - this.performanceStart,
		} as TimeUsageType;
	}
}
