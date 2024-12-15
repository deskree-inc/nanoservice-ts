import { type BlueprintContext, BlueprintTrigger, type LoggerContext } from "@deskree/blueprint-shared";
import { v4 as uuid } from "uuid";
import Configuration from "./Configuration";
import DefaultLogger from "./DefaultLogger";
import Runner from "./Runner";

export default abstract class TriggerBase extends BlueprintTrigger {
	public configuration: Configuration;

	constructor() {
		super();
		this.configuration = new Configuration();
	}

	abstract listen(): Promise<number>;

	getConfiguration(): Configuration {
		return new Configuration();
	}

	getRunner(): Runner {
		return new Runner(this.configuration.steps);
	}

	async run(ctx: BlueprintContext): Promise<BlueprintContext> {
		const runner: Runner = await this.getRunner();
		return await runner.run(ctx);
	}

	createContext(logger?: LoggerContext, blueprintName?: string, id?: string): BlueprintContext {
		const requestId: string = id || uuid();
		const ctx: BlueprintContext = {
			id: requestId,
			config: this.configuration.nodes,
			request: { body: {} },
			response: { data: "", contentType: "", success: true, error: null },
			error: { message: [] },
			logger: logger || new DefaultLogger(blueprintName, requestId),
			eventLogger: null,
			_PRIVATE_: null,
		};

		Object.defineProperty(ctx, "id", {
			value: requestId,
			enumerable: true,
		});

		Object.defineProperty(ctx, "env", {
			value: process.env,
			enumerable: true,
		});

		return ctx;
	}

	startCounter() {
		return performance.now();
	}

	endCounter(start: number) {
		return performance.now() - start;
	}
}
