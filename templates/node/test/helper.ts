import type { BlueprintContext } from "@deskree/blueprint-shared";
import type { ParamsDictionary } from "@nanoservice/runner";

export default function ctx(): BlueprintContext {
	const ctx: BlueprintContext = {
		response: {
			data: null,
			error: null,
		},
		request: {
			body: null,
		},
		config: {},
		id: "",
		error: {
			message: undefined,
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
