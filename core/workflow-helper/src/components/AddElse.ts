import { z } from "zod";
import { type StepOpts, StepOptsSchema } from "../types/StepOpts";

export default class AddElse {
	private steps: StepOpts[] = [];

	addStep(step: StepOpts): AddElse {
		this.steps.push(step);
		return this;
	}

	build(): ConditionElseOpts {
		const model: ConditionElseOpts = {
			type: "else",
			steps: this.steps,
		};

		ConditionElseSchema.parse(model);

		return model;
	}
}

const ConditionElseSchema = z.object({
	type: z.enum(["if", "else"]),
	steps: z.array(StepOptsSchema).optional(),
});

export type ConditionElseOpts = z.infer<typeof ConditionElseSchema>;
