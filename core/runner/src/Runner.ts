import { type Context, GlobalError } from "@nanoservice-ts/shared";
import type NanoService from "./NanoService";
import RunnerSteps from "./RunnerSteps";

export default class Runner extends RunnerSteps {
	private steps: NanoService[];

	constructor(steps: NanoService[] = []) {
		super();
		this.steps = steps;
	}

	async run(ctx: Context): Promise<Context> {
		try {
			return await this.runSteps(ctx, this.steps);
		} catch (e: unknown) {
			let error_context = <GlobalError>{};
			if (e instanceof GlobalError) {
				error_context = e as GlobalError;
				ctx.error.message = error_context.context.message;
			} else {
				ctx.response.error = new GlobalError((e as Error).message);
				ctx.response.error.setStack((e as Error).stack);
				ctx.response.error.setCode(500);
				ctx.response.error.setName("Runner");
				ctx.response.success = false;
				ctx.error.message = (e as Error).message;
			}

			ctx.response.data = null;
			ctx.response.error = error_context;

			ctx.logger.log(`Error: ${error_context.message}`);
			throw error_context;
		}
	}
}
