import assert from "node:assert";
import { before, describe, it } from "node:test";
import type { BlueprintContext, ConfigContext } from "@deskree/blueprint-shared";
import type { ParamsDictionary } from "nanoservice-ts-runner";
import Node, { type NodeOptions } from "../index";

function generateCtx(name: string): BlueprintContext {
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
		[name]: {
			conditions: [
				{
					type: "if",
					condition: "data !== undefined",
					steps: [
						{
							name: "fix-json-key",
							node: "fix-json-key",
							type: "local",
						},
					],
				},
				{
					type: "else",
					steps: [
						{
							name: "add-properties",
							node: "add-properties",
							type: "local",
						},
					],
				},
			],
		},
	} as unknown as ParamsDictionary;

	return ctx;
}

describe("IfElse", () => {
	let node: Node;
	let ctx: BlueprintContext;

	before(() => {
		node = new Node();
		node.name = "if-else";
		ctx = generateCtx(node.name);
	});

	it("should get the step if condition is true", async () => {
		const result = await node.run(ctx);
		assert.deepStrictEqual(result, [{ name: "fix-json-key", node: "fix-json-key", type: "local" }]);
	});

	it("should get the step if condition is false", async () => {
		const opts = (ctx.config as ParamsDictionary)[node.name] as unknown as NodeOptions;

		opts.conditions[0].condition = "data === undefined";
		const result = await node.run(ctx);
		assert.deepStrictEqual(result, [{ name: "add-properties", node: "add-properties", type: "local" }]);
	});

	it("should throw error if no config is provided", async () => {
		let opts = (ctx.config as ParamsDictionary)[node.name] as unknown as NodeOptions;

		opts.conditions[1].type = "if";
		await assert.rejects(async () => await node.run(ctx));

		opts.conditions[0].type = "else";
		await assert.rejects(async () => await node.run(ctx));

		opts.conditions = [];
		await assert.rejects(async () => await node.run(ctx));

		opts = <NodeOptions>{};
		await assert.rejects(async () => await node.run(ctx));

		ctx.config = <ConfigContext>{};
		await assert.rejects(async () => await node.run(ctx));
	});
});
