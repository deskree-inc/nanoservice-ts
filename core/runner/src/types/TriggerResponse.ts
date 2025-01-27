import type { Context, MetricsType } from "@nanoservice-ts/shared";

type TriggerResponse = {
	ctx: Context;
	metrics: MetricsType;
};

export default TriggerResponse;
