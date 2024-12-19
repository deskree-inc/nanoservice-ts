import { z } from "zod";
import { type StepOpts, StepOptsSchema } from "../types/StepOpts";

export default class AddIf {
	private condition: string;
	private steps: StepOpts[] = [];

	constructor(condition: string) {
		this.condition = condition;
	}

	addStep(step: StepOpts): AddIf {
		this.steps.push(step);
		return this;
	}

	build(): ConditionOpts {
		const model: ConditionOpts = {
			type: "if",
			condition: this.condition,
			steps: this.steps,
		};

		ConditionSchema.parse(model);

		return model;
	}
}

const ConditionSchema = z.object({
	type: z.enum(["if", "else"]),
	condition: z
		.string({
			required_error: "Condition is required",
			invalid_type_error: "Condition must be a string",
		})
		.min(1),
	steps: z.array(StepOptsSchema).optional(),
});

export type ConditionOpts = z.infer<typeof ConditionSchema>;
