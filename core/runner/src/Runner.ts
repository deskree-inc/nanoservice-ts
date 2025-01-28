import type { Context } from "@nanoservice-ts/shared";
import type NanoService from "./NanoService";
import RunnerSteps from "./RunnerSteps";

export default class Runner extends RunnerSteps {
	private steps: NanoService[];

	constructor(steps: NanoService[] = []) {
		super();
		this.steps = steps;
	}

	async run(ctx: Context): Promise<Context> {
		return await this.runSteps(ctx, this.steps);
	}
}
