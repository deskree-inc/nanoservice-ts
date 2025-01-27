type LoggerContext = {
	log(message: string): void;
	getLogs(): string[];
	getLogsAsText(): string;
	getLogsAsBase64(): string;
	logLevel(level: string, message: string): void;
	error(message: string, stack: string): void;
};

export default LoggerContext;
