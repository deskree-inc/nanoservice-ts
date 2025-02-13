import type { ConditionOpts } from "@nanoservice-ts/helper";
import { type Condition, type INanoServiceResponse, NanoService } from "@nanoservice-ts/runner";
import type { Context, NodeBase } from "@nanoservice-ts/shared";
import type ParamsDictionary from "@nanoservice-ts/shared/dist/types/ParamsDictionary";

export default class IfElse extends NanoService<Array<Condition>> {
	constructor() {
		super();
		this.flow = true;
		this.contentType = "";
	}

	async handle(ctx: Context, inputs: Array<Condition>): Promise<INanoServiceResponse | NanoService<Condition[]>[]> {
		let steps: NodeBase[] = [];
		const conditions = inputs;

		const firstCondition = conditions[0] as ConditionOpts;
		if (firstCondition.type !== "if") throw new Error("First condition must be an if");

		if (conditions.length > 1) {
			const lastCondition = conditions[conditions.length - 1];
			if (lastCondition.type !== "else") throw new Error("Last condition must be an else");
		}

		for (let i = 0; i < conditions.length; i++) {
			const condition = conditions[i];

			if (condition.condition !== undefined && condition.condition.trim() !== "") {
				const result = this.runJs(condition.condition, ctx, ctx.response.data as ParamsDictionary, {}, ctx.vars);

				if (result) {
					steps = condition.steps as NodeBase[];
					break;
				}
			} else {
				steps = condition.steps as NodeBase[];
				break;
			}
		}

		return steps as unknown as NanoService<Condition[]>[];
	}
}

type NodeOptions = {
	conditions: Condition[];
};

export type { NodeOptions };
