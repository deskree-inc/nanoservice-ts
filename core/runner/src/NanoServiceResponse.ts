import type { GlobalError, NodeBase, ResponseContext } from "@nanoservice-ts/shared";
import type JsonLikeObject from "./types/JsonLikeObject";

export interface INanoServiceResponse extends ResponseContext {
	steps: NodeBase[];
}

export default class NanoServiceResponse implements INanoServiceResponse {
	public steps: NodeBase[];
	public data: string | JsonLikeObject | JsonLikeObject[];
	public error: GlobalError | null;
	public success?: boolean | undefined;
	public contentType?: string | undefined;

	constructor() {
		this.steps = [];
		this.data = {};
		this.error = null;
		this.success = true;
		this.contentType = "application/json";
	}

	setError(error: GlobalError): void {
		this.error = error;
		this.success = false;
		this.data = {};
	}

	setSuccess(data: string | JsonLikeObject | JsonLikeObject[]): void {
		this.data = data;
		this.error = null;
		this.success = true;
	}

	setSteps(steps: NodeBase[]): void {
		this.steps = steps;
	}
}
