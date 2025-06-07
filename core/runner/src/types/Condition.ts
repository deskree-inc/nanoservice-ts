import type { NodeBase } from "../shared";

type Condition = {
	type?: string;
	condition: string;
	steps?: NodeBase[];
	error?: string;
};

export default Condition;
