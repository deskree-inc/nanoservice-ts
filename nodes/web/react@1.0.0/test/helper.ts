import type { ParamsDictionary } from "@nanoservice-ts/runner";
import type { Context } from "@nanoservice-ts/shared";

export default function ctx(): Context {
	const ctx: Context = {
		response: {
			data: {
				title: "Chat bot",
			},
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
			logLevel: (level: string, message: string): void => {
				throw new Error("Function not implemented.");
			},
			error: (message: string, stack: string): void => {
				throw new Error("Function not implemented.");
			},
		},
		eventLogger: undefined,
		_PRIVATE_: undefined,
	};

	ctx.config = {
		react: {
			inputs: {
				file_path: "./dist/app/index.merged.min.js",
			},
		},
	} as unknown as ParamsDictionary;

	return ctx;
}
