import { type BlueprintContext, BlueprintError } from "@deskree/blueprint-shared";
import type NanoService from "./NanoService";
import RunnerSteps from "./RunnerSteps";

export default class Runner extends RunnerSteps {
	private steps: NanoService[];

	constructor(steps: NanoService[] = []) {
		super();
		this.steps = steps;
	}

	async run(ctx: BlueprintContext): Promise<BlueprintContext> {
		try {
			return await this.runSteps(ctx, this.steps);
		} catch (e: unknown) {
			let error_context = <BlueprintError>{};
			if (e instanceof BlueprintError) {
				error_context = e as BlueprintError;
				ctx.error.message = error_context.context.message;
			} else {
				ctx.response.error = new BlueprintError((e as Error).message);
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
