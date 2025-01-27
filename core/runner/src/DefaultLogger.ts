import { GlobalLogger } from "@nanoservice-ts/shared";

export default class DefaultLogger extends GlobalLogger {
	workflowName: string | undefined = "";
	workflowPath: string | undefined = "";
	requestId: string | undefined = "";
	env: string | undefined = "";
	appName: string | undefined = "";

	constructor(workflowName?: string, workflowPath?: string, requestId?: string) {
		super();
		this.workflowName = workflowName;
		this.workflowPath = workflowPath;
		this.requestId = requestId;
		this.env = process.env.NODE_ENV;
		this.appName = process.env.APP_NAME;
	}

	log(message: string) {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.log(this.injectMetadata(message));
	}

	logLevel(level: string, message: string): void {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.log(this.injectMetadata(message, level));
	}

	error(message: string, stack = ""): void {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		console.error(this.injectMetadata(message, "error", stack));
	}

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
