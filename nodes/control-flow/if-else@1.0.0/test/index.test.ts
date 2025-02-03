import type { Condition, JsonLikeObject, ParamsDictionary } from "@nanoservice-ts/runner";
import type { Context, NodeBase, ResponseContext } from "@nanoservice-ts/shared";
import { describe, expect, it } from "vitest";
import IfElse from "../index";

describe("IfElse Node", () => {
	const mockContext: Context = {
		response: {
			data: null,
			error: null,
		},
		request: {
			body: <ParamsDictionary>{},
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

	const step: {
		name: string;
		run?: (ctx: Context, data: ParamsDictionary) => Promise<ResponseContext>;
	} = {
		name: "node1",
		run: async (ctx: Context, data: ParamsDictionary): Promise<ResponseContext> => <ResponseContext>{},
	} as unknown as NodeBase;

	it("should execute the correct steps when if condition is true", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "if",
				condition: "ctx.request.method === 'GET'",
				steps: [
					(() => {
						step.name = "step1";
						return step as unknown as NodeBase;
					})(),
				],
			},
			{
				type: "else",
				steps: [step as unknown as NodeBase],
				condition: "",
			},
		];

		(mockContext.request as JsonLikeObject).method = "GET";
		const result = (await ifElseNode.handle(mockContext, conditions)) as NodeBase[];
		expect(result[0].name).toEqual("step1");
	});

	it("should execute the else step when if condition is false", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "if",
				condition: "ctx.request.method === 'POST'",
				steps: [step as unknown as NodeBase],
			},
			{
				type: "else",
				steps: [
					(() => {
						step.name = "step2";
						return step as unknown as NodeBase;
					})(),
				],
				condition: "",
			},
		];

		const result = (await ifElseNode.handle(mockContext, conditions)) as NodeBase[];
		expect(result[0].name).toEqual("step2");
	});

	it("should throw an error if the first condition is not 'if'", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "else",
				steps: [step as unknown as NodeBase],
				condition: "",
			},
		];

		await expect(ifElseNode.handle(mockContext, conditions)).rejects.toThrow("First condition must be an if");
	});

	it("should throw an error if the last condition is not 'else'", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "if",
				condition: "ctx.request.method === 'GET'",
				steps: [step as unknown as NodeBase],
			},
			{
				type: "if",
				condition: "ctx.request.method === 'POST'",
				steps: [step as unknown as NodeBase],
			},
		];

		await expect(ifElseNode.handle(mockContext, conditions)).rejects.toThrow("Last condition must be an else");
	});

	it("should execute the first matching condition", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "if",
				condition: "ctx.request.method === 'POST'",
				steps: [step as unknown as NodeBase],
			},
			{
				type: "if",
				condition: "ctx.request.method === 'GET'",
				steps: [
					(() => {
						step.name = "step2";
						return step as unknown as NodeBase;
					})(),
				],
			},
			{
				type: "else",
				steps: [step as unknown as NodeBase],
				condition: "",
			},
		];

		(mockContext.request as JsonLikeObject).method = "GET";
		const result = (await ifElseNode.handle(mockContext, conditions)) as NodeBase[];
		expect(result[0].name).toEqual("step2");
	});

	it("should execute the else condition if none match", async () => {
		const ifElseNode = new IfElse();
		const conditions: Condition[] = [
			{
				type: "if",
				condition: "ctx.request.method === 'POST'",
				steps: [step as unknown as NodeBase],
			},
			{
				type: "else",
				steps: [
					(() => {
						step.name = "step2";
						return step as unknown as NodeBase;
					})(),
				],
				condition: "",
			},
		];

		const result = (await ifElseNode.handle(mockContext, conditions)) as NodeBase[];
		expect(result[0].name).toEqual("step2");
	});
});
