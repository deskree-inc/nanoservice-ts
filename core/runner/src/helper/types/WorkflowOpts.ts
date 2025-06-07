import { z } from "zod";
import { StepInputsSchema, StepOptsSchema } from "./StepOpts";
import { TriggerOptsSchema, TriggersSchema } from "./TriggerOpts";

export const WorkflowOptsSchema = z.object({
	name: z
		.string({
			required_error: "Name is required",
			invalid_type_error: "Name must be a string",
		})
		.min(3),
	version: z
		.string({
			required_error: "Version is required",
			invalid_type_error: "Version must be a string",
		})
		.min(5, { message: "Format required x.x.x" }),
	description: z.string().optional(),
	steps: z.array(StepOptsSchema).optional(),
	nodes: z.record(z.string(), StepInputsSchema).optional(),
	trigger: z.record(TriggersSchema, TriggerOptsSchema).optional(),
});

export type WorkflowOpts = z.infer<typeof WorkflowOptsSchema>;
