import { type Context, GlobalError, type NodeBase, type Step } from "@nanoservice-ts/shared";
import type NanoService from "./NanoService";
import type NanoServiceResponse from "./NanoServiceResponse";

export default abstract class RunnerSteps {
	async runSteps(ctx: Context, steps: NanoService[], deep = false, step_name = ""): Promise<Context> {
		ctx.config = { ...ctx.config };

		try {
			ctx.logger.log(`Starting runner for ${steps.length} steps ${!deep ? "(Parent)" : `(${step_name})`}`);
			let flow = false;
			let flow_steps: NanoService[] = [];
			let flow_step = 0;
			let stepName = "";

			for (let i = 0; i < steps.length; i++) {
				const step: NodeBase = steps[i];
				if (!step.active) continue;
				if (step.stop) break;
				ctx.response.contentType = step.contentType;

				if (!step.flow) {
					const model = await step.process(ctx, step as unknown as Step);
					ctx.response = model.data as NanoServiceResponse;
					if (ctx.response.error) throw ctx.response.error;
				} else {
					stepName = step.name;
					flow_steps = (await step.processFlow(ctx)).data as NanoService[];

					flow = true;
					flow_step = i;

					break;
				}
			}

			if (flow) {
				const nextSteps = steps.length > flow_step + 1 ? steps.slice(flow_step + 1) : [];
				return await this.runSteps(ctx, [...flow_steps, ...nextSteps], true, stepName);
			}
		} catch (e: unknown) {
			let error_context = <Error>{};
			if (e instanceof GlobalError) {
				error_context = e as GlobalError;
			} else {
				error_context = new GlobalError((e as Error).message);
			}

			throw error_context;
		}

		return ctx;
	}
}
