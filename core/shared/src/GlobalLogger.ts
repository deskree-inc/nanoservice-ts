import type LoggerContext from "./types/LoggerContext";

export default abstract class GlobalLogger implements LoggerContext {
	protected logs: string[];

	constructor() {
		this.logs = [];
	}

	abstract log(message: string): void;
	abstract logLevel(level: string, message: string): void;
	abstract error(message: string, stack: string): void;

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
