import type { WorkflowOpts } from "../types/WorkflowOpts";

export default class HelperResponse {
	protected _config: WorkflowOpts = <WorkflowOpts>{};

	setConfig(config: WorkflowOpts): void {
		this._config = config;
	}

	toJson(): string {
		return JSON.stringify(this._config);
	}
}
