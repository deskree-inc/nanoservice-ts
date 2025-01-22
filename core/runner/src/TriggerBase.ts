import { type Context, type LoggerContext, Trigger } from "@nanoservice-ts/shared";
import { v4 as uuid } from "uuid";
import Configuration from "./Configuration";
import DefaultLogger from "./DefaultLogger";
import Runner from "./Runner";

export default abstract class TriggerBase extends Trigger {
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

	async run(ctx: Context): Promise<Context> {
		try {
			const runner: Runner = this.getRunner();
			return await runner.run(ctx);
		} catch (e: unknown) {
			console.log(e);
			throw e;
		}
	}

	createContext(logger?: LoggerContext, blueprintName?: string, id?: string): Context {
		const requestId: string = id || uuid();
		const ctx: Context = {
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
