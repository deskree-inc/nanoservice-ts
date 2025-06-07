import type RunnerNode from "../RunnerNode";
import type { NodeBase } from "../shared";
import type Node from "./Node";
import type Trigger from "./Trigger";

type Config = {
	name: string;
	version: string;
	steps: NodeBase[] | RunnerNode[];
	nodes: Node;
	trigger: Trigger;
};

export default Config;
