type LoggerContext = {
	log(message: string): void;
	getLogs(): string[];
	getLogsAsText(): string;
	getLogsAsBase64(): string;
};

export default LoggerContext;
