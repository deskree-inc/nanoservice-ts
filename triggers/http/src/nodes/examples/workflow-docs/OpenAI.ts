import { createOpenAI } from "@ai-sdk/openai";
import { type INodeBlokResponse, NodeBlok, NodeBlokResponse } from "@blok-ts/runner";
import { type Context, GlobalError } from "@blok-ts/runner";
import { generateText } from "ai";
import InMemory from "./InMemory";

type InputType = {
	cache_key: string;
	system: string[];
	prompt: string[];
};

export default class OpenAI extends NodeBlok<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				cache_key: { type: "string" },
				system: {
					type: "array",
					items: {
						type: "string",
					},
				},
				prompt: {
					type: "array",
					items: {
						type: "string",
					},
				},
			},
			required: ["prompt"],
		};

		this.contentType = "text/html";
	}

	async handle(ctx: Context, inputs: InputType): Promise<INodeBlokResponse> {
		const response: NodeBlokResponse = new NodeBlokResponse();

		try {
			const cache = InMemory.getInstance();
			const cachedValue =
				inputs.cache_key !== undefined && inputs.cache_key !== "" ? cache.get(inputs.cache_key) : undefined;

			if (cachedValue) {
				response.setSuccess(cachedValue);
			} else {
				const openai = createOpenAI({
					compatibility: "strict",
					apiKey: process.env.OPENAI_API_KEY,
				});

				const { text } = await generateText({
					model: openai("gpt-4o"),
					system: inputs.system?.join(","),
					prompt: inputs.prompt.join(","),
					temperature: 0.2,
				});

				cache.set(inputs.cache_key, text);

				response.setSuccess(text);
			}
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		}

		return response;
	}
}
