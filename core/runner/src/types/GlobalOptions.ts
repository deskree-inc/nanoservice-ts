import type NodeMap from "../NodeMap";
import type { HelperResponse } from "../helper";

type GlobalOptions = {
	nodes: NodeMap;
	workflows: WorkflowLocator;
};

type WorkflowLocator = { [key: string]: HelperResponse };

export default GlobalOptions;
export type { WorkflowLocator };
