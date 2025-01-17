import type Context from "./Context";

type Step = {
	name: string;
	node: string;
	type: string;
	active?: boolean;
	stop?: boolean;
	run(ctx: Context): Promise<unknown>;
};

export default Step;
