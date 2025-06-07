import type TriggerHttp from "./TriggerHttp";
import type TriggerMcp from "./TriggerMcp";

type Trigger = {
	[key: string]: TriggerHttp | TriggerMcp;
};

export default Trigger;
