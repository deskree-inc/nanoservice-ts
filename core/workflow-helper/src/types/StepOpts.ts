import { z } from "zod";
import type { ConditionElseOpts } from "../components/AddElse";
import type { ConditionOpts } from "../components/AddIf";

export const StepOptsSchema = z.object({
	name: z
		.string({
			required_error: "Name is required",
			invalid_type_error: "Name must be a string",
		})
		.min(3),
	node: z
		.string({
			required_error: "Node is required",
			invalid_type_error: "Node must be a string",
		})
		.min(5),
	type: z.enum(["local", "module"]),
	inputs: z.object({}).optional(),
});

export type StepOpts = z.infer<typeof StepOptsSchema>;

// It is used globally in the project
export const StepInputsSchema = z.object({}, { message: "Inputs required" });
export type StepInputs = z.infer<typeof StepInputsSchema>;

export const StepConditionSchema = z.object({
	node: StepOptsSchema,
	conditions: z.function().optional(),
});

export interface IConditions {
	conditions: () => ConditionOpts[] | ConditionElseOpts[];
}

export type StepConditionOpts = z.infer<typeof StepConditionSchema>;
