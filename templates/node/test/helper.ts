import type { ParamsDictionary } from "@nanoservice-ts/runner";
import type { Context } from "@nanoservice-ts/shared";

export default function ctx(): Context {
	const ctx: Context = {
		response: {
			data: null,
			error: null,
		},
		request: {
			body: {},
		},
		config: {},
		id: "",
		error: {
			message: "",
			code: undefined,
			json: undefined,
			stack: undefined,
			name: undefined,
		},
		logger: {
			log: (message: string): void => {
				throw new Error("Function not implemented.");
			},
			getLogs: (): string[] => {
				throw new Error("Function not implemented.");
			},
			getLogsAsText: (): string => {
				throw new Error("Function not implemented.");
			},
			getLogsAsBase64: (): string => {
				throw new Error("Function not implemented.");
			},
		},
		eventLogger: undefined,
		_PRIVATE_: undefined,
	};

	ctx.config = {
		"api-call": {
			inputs: {
				url: "https://jsonplaceholder.typicode.com/todos/1",
				method: "GET",
			},
		},
	} as unknown as ParamsDictionary;

	return ctx;
}
