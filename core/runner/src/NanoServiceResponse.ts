import type { BlueprintError, ResponseContext } from "@deskree/blueprint-shared";
import type NanoService from "./NanoService";
import type JsonLikeObject from "./types/JsonLikeObject";

export interface INanoServiceResponse extends ResponseContext {
	steps: NanoService[];
}

export default class NanoServiceResponse implements INanoServiceResponse {
	public steps: NanoService[];
	public data: string | JsonLikeObject;
	public error: BlueprintError | null;
	public success?: boolean | undefined;
	public contentType?: string | undefined;

	constructor() {
		this.steps = [];
		this.data = {};
		this.error = null;
		this.success = true;
		this.contentType = "application/json";
	}

	setError(error: BlueprintError): void {
		this.error = error;
		this.success = false;
		this.data = {};
	}

	setSuccess(data: string | JsonLikeObject): void {
		this.data = data;
		this.error = null;
		this.success = true;
	}

	setSteps(steps: NanoService[]): void {
		this.steps = steps;
	}
}
