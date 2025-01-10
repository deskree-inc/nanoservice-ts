import type { BlueprintContext, BlueprintNode } from "@deskree/blueprint-shared";
import type { ConditionOpts } from "@nanoservice-ts/helper";
import { type Condition, type INanoServiceResponse, type JsonLikeObject, NanoService } from "@nanoservice-ts/runner";

export default class IfElse extends NanoService {
	constructor() {
		super();
		this.flow = true;
		this.contentType = "";
	}

	async handle(
		ctx: BlueprintContext,
		inputs: JsonLikeObject | Condition[],
	): Promise<INanoServiceResponse | NanoService[]> {
		let steps: BlueprintNode[] = [];
		const conditions = inputs as Condition[];

		const firstCondition = conditions[0] as ConditionOpts;
		if (firstCondition.type !== "if") throw new Error("First condition must be an if");

		if (conditions.length > 1) {
			const lastCondition = conditions[conditions.length - 1];
			if (lastCondition.type !== "else") throw new Error("Last condition must be an else");
		}

		for (let i = 0; i < conditions.length; i++) {
			const condition = conditions[i];

			if (condition.condition !== undefined && condition.condition.trim() !== "") {
				const result = this.runJs(condition.condition, ctx, ctx.response.data, {}, ctx.vars);

				if (result) {
					steps = condition.steps as BlueprintNode[];
					break;
				}
			} else {
				steps = condition.steps as BlueprintNode[];
				break;
			}
		}

		return steps as NanoService[];
	}
}

type NodeOptions = {
	conditions: Condition[];
};

export type { NodeOptions };
