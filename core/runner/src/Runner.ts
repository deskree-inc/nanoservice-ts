import type { Context, NodeBase } from "@nanoservice-ts/shared";
import RunnerSteps from "./RunnerSteps";

/**
 * Runner class that extends RunnerSteps to execute a series of NanoService steps.
 */
export default class Runner extends RunnerSteps {
	private steps: NodeBase[];

	/**
	 * Constructs a new Runner instance.
	 *
	 * @param steps - An array of NanoService steps to be executed.
	 */
	constructor(steps: NodeBase[] = []) {
		super();
		this.steps = steps;
	}

	/**
	 * Executes the series of NanoService steps with the given context.
	 *
	 * @param ctx - The context to be passed through the steps.
	 * @returns A promise that resolves to the final context after all steps have been executed.
	 */
	async run(ctx: Context): Promise<Context> {
		return await this.runSteps(ctx, this.steps);
	}
}
