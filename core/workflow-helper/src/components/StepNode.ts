import {
	type IConditions,
	type StepConditionOpts,
	StepConditionSchema,
	type StepOpts,
	StepOptsSchema,
} from "../types/StepOpts";
import type { ConditionElseOpts } from "./AddElse";
import type { ConditionOpts } from "./AddIf";
import HelperResponse from "./HelperResponse";

export default class StepNode extends HelperResponse {
	addStep(config: StepOpts): StepNode {
		StepOptsSchema.parse(config);

		if (this._config.nodes === undefined) this._config.nodes = {};
		this._config.nodes[config.name] = {
			inputs: config.inputs,
		};

		this._config.steps?.push({
			name: config.name,
			node: config.node,
			type: config.type,
		});

		const helperResponse = new StepNode();
		helperResponse.setConfig(this._config);
		return helperResponse;
	}

	addCondition(conditions: StepConditionOpts): StepNode {
		StepConditionSchema.parse(conditions);
		const func = conditions as unknown as IConditions;
		const response = func.conditions() as ConditionOpts[] | ConditionElseOpts[];

		if (this._config.nodes === undefined) this._config.nodes = {};

		for (let i = 0; i < response.length; i++) {
			const condition = response[i];
			const steps = condition.steps as StepOpts[];

			for (let j = 0; j < steps.length; j++) {
				const step = steps[j];

				this._config.nodes[step.name] = {
					inputs: step.inputs,
				};

				step.inputs = undefined;
			}
		}

		if (this._config.steps === undefined) this._config.steps = [];
		this._config.steps.push(conditions.node);
		this._config.nodes[conditions.node.name] = {
			conditions: response,
		};

		const helperResponse = new StepNode();
		helperResponse.setConfig(this._config);
		return helperResponse;
	}
}
