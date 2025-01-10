import { type BlueprintContext, BlueprintError, type BlueprintNode } from "@deskree/blueprint-shared";
import type NanoService from "./NanoService";
import type NanoServiceResponse from "./NanoServiceResponse";

export default abstract class RunnerSteps {
	async runSteps(ctx: BlueprintContext, steps: NanoService[]): Promise<BlueprintContext> {
		ctx.config = { ...ctx.config };

		try {
			ctx.logger.log(`Starting runner for ${steps.length} steps`);
			let flow = false;
			let flow_steps: NanoService[] = [];
			let flow_step = 0;

			for (let i = 0; i < steps.length; i++) {
				const step: BlueprintNode = steps[i];
				if (!step.active) continue;
				if (step.stop) break;
				ctx.response.contentType = step.contentType;

				if (!step.flow) {
					ctx.response = (await step.process(ctx, step)).data as NanoServiceResponse;
					if (ctx.response.error) throw ctx.response.error;
				} else {
					flow_steps = (await step.processFlow(ctx)).data as NanoService[];

					flow = true;
					flow_step = i;

					break;
				}
			}

			if (flow) {
				const nextSteps = steps.length > flow_step + 1 ? steps.slice(flow_step + 1) : [];
				return await this.runSteps(ctx, [...flow_steps, ...nextSteps]);
			}
		} catch (e: unknown) {
			let error_context = <Error>{};
			if (e instanceof BlueprintError) {
				error_context = e as BlueprintError;
			} else {
				error_context = new BlueprintError((e as Error).message);
			}

			throw error_context;
		}

		return ctx;
	}
}
