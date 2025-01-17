import type { NodeBase } from "@nanoservice-ts/shared";

type Condition = {
	type?: string;
	condition: string;
	steps?: NodeBase[];
	error?: string;
};

export default Condition;
