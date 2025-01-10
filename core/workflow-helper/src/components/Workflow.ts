import { type WorkflowOpts, WorkflowOptsSchema } from "../types/WorkflowOpts";
import Trigger from "./Trigger";

export default function Workflow(config: WorkflowOpts): Trigger {
	WorkflowOptsSchema.parse(config);
	config.steps = [];
	config.nodes = {};

	const helperResponse = new Trigger();
	helperResponse.setConfig(config);
	return helperResponse;
}
