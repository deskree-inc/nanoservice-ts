import {
	type BlueprintContext,
	BlueprintError,
	type BlueprintNode,
	type ResponseContext,
} from "@deskree/blueprint-shared";

export default class Runner {
	private steps: BlueprintNode[];

	constructor(steps: BlueprintNode[] = []) {
		this.steps = steps;
	}

	async run(ctx: BlueprintContext): Promise<BlueprintContext> {
		ctx.config = { ...ctx.config };

		try {
			ctx.logger.log(`Starting runner for ${this.steps.length} steps`);
			let flow = false;
			let flow_steps: ResponseContext = <ResponseContext>{};
			let flow_step = 0;

			for (let i = 0; i < this.steps.length; i++) {
				const step: BlueprintNode = this.steps[i];
				if (!step.active) continue;
				if (step.stop) break;
				ctx.response.contentType = step.contentType;

				if (!step.flow) {
					ctx.response = await step.process(ctx, step);
					if (ctx.response.error) throw ctx.response.error;
				} else {
					flow_steps = await step.processFlow(ctx);
					if (flow_steps.error) throw flow_steps.error;

					flow = true;
					flow_step = i;

					break;
				}
			}

			if (flow) {
				const nextSteps = this.steps.length > flow_step + 1 ? this.steps.slice(flow_step + 1) : [];
				// @ts-ignore
				this.steps = [...flow_steps, ...nextSteps];
				return await this.run(ctx);
			}
		} catch (e: unknown) {
			let error_context = new BlueprintError((e as Error).message);
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

		return ctx;
	}
}
