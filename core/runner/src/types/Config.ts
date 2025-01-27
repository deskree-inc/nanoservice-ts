import type { NodeBase } from "@nanoservice-ts/shared";
import type RunnerNode from "../RunnerNode";
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
