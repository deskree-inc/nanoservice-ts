import type LoggerContext from "./types/LoggerContext";

export default abstract class GlobalLogger implements LoggerContext {
	protected logs: string[];

	constructor() {
		this.logs = [];
	}

	abstract log(message: string): void;

	getLogs() {
		return this.logs;
	}

	getLogsAsText() {
		return this.logs.join("\n");
	}

	getLogsAsBase64() {
		return Buffer.from(this.logs.join("\n")).toString("base64");
	}
}
