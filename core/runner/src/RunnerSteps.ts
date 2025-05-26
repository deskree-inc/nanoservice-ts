import { type Context, GlobalError, type NodeBase, type Step } from "@nanoservice-ts/shared";
import { metrics } from "@opentelemetry/api";
import type NanoServiceResponse from "./NanoServiceResponse";
import type RunnerNode from "./RunnerNode";

export default abstract class RunnerSteps {
	/**
	 * Executes a series of steps in the given context.
	 *
	 * @param ctx - The context in which the steps are executed.
	 * @param steps - An array of NanoService steps to be executed.
	 * @param deep - A boolean indicating whether the function is being called recursively for flow steps.
	 * @param step_name - The name of the current step being processed in a flow.
	 * @returns A promise that resolves to the updated context after all steps have been executed.
	 * @throws {GlobalError} Throws a GlobalError if any step results in an error.
	 */
	async runSteps(ctx: Context, steps: NodeBase[], deep = false, step_name = ""): Promise<Context> {
		ctx.config = { ...ctx.config };

		try {
			ctx.logger.log(`Starting runner for ${steps.length} steps ${!deep ? "(Parent)" : `(${step_name})`}`);
			let flow = false;
			let flow_steps: NodeBase[] = [];
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

					if (ctx.response.success === false) {
						const defaultMeter = metrics.getMeter("default");
						const node_errors = defaultMeter.createCounter("node_errors", {
							description: "Node errors",
						});

						node_errors.add(1, {
							env: process.env.NODE_ENV,
							workflow_path: `${ctx.workflow_path}`,
							workflow_name: `${ctx.workflow_name}`,
							node_name: `${step.name}`,
							node: (this as unknown as RunnerNode).node,
						});
					}

					if (ctx.response.error) throw ctx.response.error;
				} else {
					stepName = step.name;
					flow_steps = (await step.processFlow(ctx)).data as NodeBase[];

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
