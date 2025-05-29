import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import createNodeSystemPrompt from "./prompts/create-node.system.js";

type NodeInformation = {
	nodeName: string;
	userPrompt: string;
	code: string;
};

export default class NodeGenerator {
	async generateNode(nodeName: string, userPrompt: string, apiKey: string): Promise<NodeInformation> {
		const openai = createOpenAI({
			compatibility: "strict",
			apiKey: apiKey,
		});

		const { text } = await generateText({
			model: openai("gpt-4o"),
			system: createNodeSystemPrompt.prompt,
			prompt: userPrompt,
			temperature: 0.2,
		});

		return {
			nodeName,
			userPrompt,
			code: text,
		};
	}
}
