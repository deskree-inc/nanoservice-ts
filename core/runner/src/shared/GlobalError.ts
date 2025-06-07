import type ParamsDictionary from "../types/ParamsDictionary";
import type ErrorContext from "./types/ErrorContext";

export default class GlobalError extends Error {
	public context: ErrorContext = { message: "" };

	constructor(msg: string | undefined) {
		super(msg);
		Object.setPrototypeOf(this, GlobalError.prototype);

		this.context.message = msg as string;
	}

	setCode(code?: number) {
		this.context.code = code;
	}
	setJson(json?: Record<string, unknown>) {
		this.context.json = json as ParamsDictionary;
	}
	setStack(stack?: string) {
		this.context.stack = stack;
	}
	setName(name?: string) {
		this.context.name = name;
	}

	hasJson(): boolean {
		return this.context.json !== undefined;
	}

	override toString(): string {
		if (this.context.json) return JSON.stringify(this.context.json);
		return this.context.message as string;
	}
}
