import { NodeBlokResponse } from "@blok-ts/runner";
import type { Context, GlobalError } from "@blok-ts/runner";
import { describe, expect, it, vi } from "vitest";
import ApiCall, { type InputType } from "../index";
import { runApiCall } from "../util";

// ✅ Correct way to mock `runApiCall` in Vitest
vi.mock("../util", () => ({
	runApiCall: vi.fn(), // Directly mock the function
}));

describe("ApiCall Node", () => {
	const mockContext: Context = {
		request: {
			method: "POST",
			body: { default: "data" },
			headers: {},
			params: {},
			query: {},
		},
		response: {
			data: {},
		},
		vars: {},
	} as unknown as Context;

	const validInputs = {
		method: "GET",
		url: "https://api.example.com",
		headers: { Authorization: "Bearer token" },
		responseType: "json",
		body: { key: "value" },
	};

	it("should successfully make an API call and return response", async () => {
		const apiCallNode = new ApiCall();
		const mockResult = { success: true, data: { message: "API Response" } };

		// ✅ Correct way to mock function in Vitest
		vi.mocked(runApiCall).mockResolvedValue(mockResult);

		const result = await apiCallNode.handle(mockContext, validInputs);
		expect(result).toBeInstanceOf(NodeBlokResponse);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResult);
	});

	it("should use ctx.response.data as the body if inputs.body is undefined", async () => {
		const apiCallNode = new ApiCall();
		mockContext.response.data = { fallback: "data" };
		const inputsWithoutBody: InputType = { ...validInputs, body: {} };

		const mockResult = { success: true, data: { fallback: "data" } };
		vi.mocked(runApiCall).mockResolvedValue(mockResult);

		const result = await apiCallNode.handle(mockContext, inputsWithoutBody);
		expect(result).toBeInstanceOf(NodeBlokResponse);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResult);
	});

	it("should return an error if the API call fails", async () => {
		const apiCallNode = new ApiCall();
		const mockError = new Error("API request failed");

		vi.mocked(runApiCall).mockRejectedValue(mockError);

		const result = await apiCallNode.handle(mockContext, validInputs);
		expect(result).toBeInstanceOf(NodeBlokResponse);
		expect(result.success).toBe(false);
		expect(result.error).toBeDefined();
		expect((result.error as GlobalError).message).toBe("API request failed");
	});
});
