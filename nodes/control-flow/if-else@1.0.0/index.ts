import { type BlueprintContext, BlueprintNode, type ResponseContext } from "@deskree/blueprint-shared";
import type { Condition, ParamsDictionary } from "nanoservice-ts-runner";
import type RunnerNode from "nanoservice-ts-runner/dist/RunnerNode";

export default class IfElse extends BlueprintNode {
	constructor() {
		super();
		this.flow = true;
		this.contentType = "";
	}

	async run(ctx: BlueprintContext): Promise<ResponseContext> {
		let steps: RunnerNode[] = [];

		if (ctx.config === undefined) throw new Error("If-else node requires a config");
		const opts = (ctx.config as ParamsDictionary)[this.name] as unknown as NodeOptions;

		if (opts === undefined) throw new Error("If-else node requires a config");
		if (opts.conditions === undefined) throw new Error("If-else node requires conditions");
		if (opts.conditions.length === 0) throw new Error("If-else node requires at least 1 conditions");

		const firstCondition = opts.conditions[0];
		if (firstCondition.type !== "if") throw new Error("First condition must be an if");

		if (opts.conditions.length > 1) {
			const lastCondition = opts.conditions[opts.conditions.length - 1];
			if (lastCondition.type !== "else") throw new Error("Last condition must be an else");
		}

		for (let i = 0; i < opts.conditions.length; i++) {
			const condition = opts.conditions[i];

			if (condition.condition !== undefined && condition.condition.trim() !== "") {
				const result = this.runJs(condition.condition, ctx, ctx.response.data, {}, ctx.vars);

				if (result) {
					steps = condition.steps as RunnerNode[];
					break;
				}
			} else {
				steps = condition.steps as RunnerNode[];
				break;
			}
		}

		// @ts-ignore
		return steps;
	}
}

type NodeOptions = {
	conditions: Condition[];
};

export type { NodeOptions };
