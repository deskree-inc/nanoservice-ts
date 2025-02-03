import { GlobalLogger } from "@nanoservice-ts/shared";

/**
 * DefaultLogger class extends GlobalLogger to provide logging functionality
 * with additional metadata such as workflow name, workflow path, request ID,
 * environment, and application name.
 */
export default class DefaultLogger extends GlobalLogger {
	/**
	 * The name of the workflow.
	 */
	workflowName: string | undefined = "";

	/**
	 * The path of the workflow.
	 */
	workflowPath: string | undefined = "";

	/**
	 * The ID of the request.
	 */
	requestId: string | undefined = "";

	/**
	 * The environment in which the application is running.
	 */
	env: string | undefined = "";

	/**
	 * The name of the application.
	 */
	appName: string | undefined = "";

	/**
	 * Constructs a new DefaultLogger instance.
	 *
	 * @param workflowName - The name of the workflow.
	 * @param workflowPath - The path of the workflow.
	 * @param requestId - The ID of the request.
	 */
	constructor(workflowName?: string, workflowPath?: string, requestId?: string) {
		super();
		this.workflowName = workflowName;
		this.workflowPath = workflowPath;
		this.requestId = requestId;
		this.env = process.env.NODE_ENV;
		this.appName = process.env.APP_NAME;
	}

	/**
	 * Logs a message to the console with metadata.
	 *
	 * @param message - The message to log.
	 */
	log(message: string) {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.log(this.injectMetadata(message));
	}

	/**
	 * Logs a message to the console with a specified log level and metadata.
	 *
	 * @param level - The log level (e.g., "info", "error").
	 * @param message - The message to log.
	 */
	logLevel(level: string, message: string): void {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.log(this.injectMetadata(message, level));
	}

	/**
	 * Logs an error message to the console with metadata.
	 *
	 * @param message - The error message to log.
	 * @param stack - The stack trace (optional).
	 */
	error(message: string, stack = ""): void {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.error(this.injectMetadata(message, "error", stack));
	}

	/**
	 * Injects metadata into a log message.
	 *
	 * @param message - The message to inject metadata into.
	 * @param level - The log level (default is "info").
	 * @param stack - The stack trace (optional).
	 * @returns The message with injected metadata.
	 */
	injectMetadata(message: string, level = "info", stack = ""): string {
		let data = `level=\"${level}\" `;
		data += `app=\"${this.appName}\" `;
		data += `env=\"${this.env}\" `;
		data += this.workflowName ? `workflow_name=\"${this.workflowName}\" ` : "";
		data += this.workflowPath ? `workflow_path=\"${this.workflowPath}\" ` : "";
		data += this.requestId ? `request_id=\"${this.requestId}\" ` : "";
		data += `message=\"${message}\"`;
		data += stack === "" ? "" : ` stack=\"${stack}\"`;
		return data;
	}
}
