import type { BlueprintNode } from "@deskree/blueprint-shared";
import type RunnerNode from "../RunnerNode";
import type Node from "./Node";
import type Trigger from "./Trigger";

type Config = {
	name: string;
	version: string;
	steps: BlueprintNode[] | RunnerNode[];
	nodes: Node;
	trigger: Trigger;
};

export default Config;
