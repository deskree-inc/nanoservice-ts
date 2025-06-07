import type { Context, MetricsType } from "../shared";

type TriggerResponse = {
	ctx: Context;
	metrics: MetricsType;
};

export default TriggerResponse;
