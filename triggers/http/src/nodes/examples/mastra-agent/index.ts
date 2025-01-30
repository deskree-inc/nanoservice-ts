import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import createTool from "./tool";
import importEsModule from "./util";

type ModelConfig = {
	provider: string;
	name: string;
};

// This is the main class that will be exported
// This class will be used to create a new instance of the node
// This class must be created using the extends NanoService
export default class MastraAgent extends NanoService {
	constructor() {
		super();

		// Set the input "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				name: {
					type: "string",
				},
				instructions: {
					type: "string",
				},
				model: {
					type: "object",
					properties: {
						provider: {
							type: "string",
						},
						name: {
							type: "string",
						},
					},
					required: ["provider", "name"],
				},
				tools: {
					type: "object",
				},
				message: {
					type: "string",
				},
			},
			required: ["name", "instructions", "model", "message"],
		};

		// Set the output "JSON Schema Format" here for automated validation
		// Learn JSON Schema: https://json-schema.org/learn/getting-started-step-by-step
		this.outputSchema = {};
	}

	async handle(ctx: Context, inputs: JsonLikeObject): Promise<INanoServiceResponse> {
		// Create a new instance of the response
		const response: NanoServiceResponse = new NanoServiceResponse();

		try {
			if (!process.versions.bun) {
				throw new Error("This node must be executed with BUN");
			}

			const { Agent } = await importEsModule("@mastra/core");
			const weatherTool = await createTool();

			const modelConfig: ModelConfig = inputs.model as unknown as ModelConfig;
			const message = inputs.message as string;

			const agent = new Agent({
				name: inputs.name as string,
				instructions: inputs.instructions as string,
				model: modelConfig,
				tools: { weatherTool }, // Optional tools
			});

			const result = await agent.generate(message);
			response.setSuccess({ text: result.text }); // Set the success
		} catch (error: unknown) {
			const nodeError: GlobalError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			nodeError.setStack((error as Error).stack);
			nodeError.setName(this.name);
			nodeError.setJson(undefined); // Return a custom JSON object here

			response.setError(nodeError); // Set the error
		}

		return response;
	}
}
