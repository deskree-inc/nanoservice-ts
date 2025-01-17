import { BlueprintLogger } from "@deskree/blueprint-shared";

export default class DefaultLogger extends BlueprintLogger {
	blueprintName: string | undefined = "";
	requestId: string | undefined = "";
	constructor(blueprintName?: string, requestId?: string) {
		super();
		this.blueprintName = blueprintName;
		this.requestId = requestId;
	}

	log(message: string) {
		if (process.env.CONSOLE_LOG_ACTIVE === "false") return;
		this.logs.push(message);
		if (this.requestId) console.log(`[${this.requestId}] ${message}`);
	}
}
