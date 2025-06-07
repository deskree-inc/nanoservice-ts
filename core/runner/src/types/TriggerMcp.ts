import type TriggerHttp from "./TriggerHttp";

interface TriggerMcp extends TriggerHttp {
	type: "tool" | "resource";
}

export default TriggerMcp;
