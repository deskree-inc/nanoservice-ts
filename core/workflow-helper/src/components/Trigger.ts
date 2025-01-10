import { type TriggerOpts, TriggerOptsSchema, type TriggersEnum, TriggersSchema } from "../types/TriggerOpts";
import HelperResponse from "./HelperResponse";
import StepNode from "./StepNode";

export default class Trigger extends HelperResponse {
	addTrigger(name: TriggersEnum, config: TriggerOpts): StepNode {
		TriggersSchema.parse(name);
		TriggerOptsSchema.parse(config);
		this._config.trigger = { [name]: config };

		const helperResponse = new StepNode();
		helperResponse.setConfig(this._config);
		return helperResponse;
	}
}
