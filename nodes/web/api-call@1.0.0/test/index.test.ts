import assert from "node:assert";
import { before, describe, it, mock } from "node:test";
import type { BlueprintContext } from "@deskree/blueprint-shared";
import type { ParamsDictionary } from "@nanoservice/runner";
import Node from "../index";

function generateCtx(): BlueprintContext {
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

describe("ApiCall", () => {
	let node: Node;

	before(() => {
		node = new Node();
		node.name = "api-call";
	});

	it("should call an api with json content-type", async () => {
		// mocking fetch api
		mock.method(global, "fetch", () => {
			return {
				headers: {
					get: () => {
						return "application/json";
					},
				},
				json: () => {
					return {
						data: {
							userId: 1,
							id: 1,
							title: "delectus aut autem",
						},
					};
				},
			};
		});
		const ctx = generateCtx();
		const result = await node.run(ctx);
		assert.ok(result);
	});

	it("should call an api with text content-type", async () => {
		// mocking fetch api
		mock.method(global, "fetch", () => {
			return {
				headers: {
					get: () => {
						return "text/plain";
					},
				},
				text: () => {
					return "lorem ipsum";
				},
			};
		});
		const ctx = generateCtx();
		const result = await node.run(ctx);
		assert.ok(result);
	});

	it("should throw an error if content-type is not supported", async () => {
		// mocking fetch api
		mock.method(global, "fetch", () => {
			return {
				headers: {
					get: () => {
						return "application/xml";
					},
				},
				text: () => {
					return "lorem ipsum";
				},
			};
		});
		const ctx = generateCtx();

		try {
			await node.run(ctx);
		} catch (e) {
			assert.ok(e);
		}
	});
});
