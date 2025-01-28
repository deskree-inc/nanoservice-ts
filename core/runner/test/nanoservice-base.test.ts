import type { Context, LoggerContext, ResponseContext } from "@nanoservice-ts/shared";
import { beforeAll, expect, test } from "vitest";
import DefaultLogger from "../src/DefaultLogger";
import NanoService from "../src/NanoService";
import NanoServiceResponse, { type INanoServiceResponse } from "../src/NanoServiceResponse";
import type JsonLikeObject from "../src/types/JsonLikeObject";

let context = <Context>{};

beforeAll(() => {
	context = <Context>{
		response: {},
		request: {},
		vars: {},
		config: {
			"add-property": {
				inputs: {
					data: {
						name: "John Doe",
					},
				},
			},
		} as JsonLikeObject,
		logger: new DefaultLogger() as LoggerContext,
	};
});

test("Execute nanoService implementation", async () => {
	const nano = new AddCreatedAtProperty();
	const response = ((await nano.run(context)) as NanoServiceResponse).data as JsonLikeObject;

	expect(response.success).toBe(true);
	expect(response.data).toHaveProperty("name");
	expect(response.data).toHaveProperty("createdAt");
	expect((response.data as JsonLikeObject).createdAt).toBe(true);
	expect(response.error).toBe(null);
});

test("Execute nanoService wrong inputs", async () => {
	const nano = new AddCreatedAtProperty();
	context.config["add-property"].inputs.data = undefined;
	try {
		await nano.run(context);
	} catch (e) {
		expect(e.message).toBe('requires property "data"');
	}
});

class AddCreatedAtProperty extends NanoService {
	constructor() {
		super();
		this.name = "add-property";
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-07/schema#",
			title: "Generated schema for Root",
			type: "object",
			properties: {
				data: {
					type: "object",
					properties: {},
					required: [],
				},
			},
			required: ["data"],
		};

		this.outputSchema = {
			type: "object",
			properties: {
				createdAt: {},
			},
			additionalProperties: false,
			oneOf: [{ required: ["createdAt"] }],
		};
	}

	public async handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse | NanoService[]> {
		const response = new NanoServiceResponse();
		const data = inputs.data as JsonLikeObject;
		data.createdAt = true;
		response.setSuccess(data);

		return response;
	}
}
