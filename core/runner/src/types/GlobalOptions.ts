import type { HelperResponse } from "nanoservice-ts-helper";
import type NodeMap from "../NodeMap";

type GlobalOptions = {
	nodes: NodeMap;
	workflows: WorkflowLocator;
};

type WorkflowLocator = { [key: string]: HelperResponse };

export default GlobalOptions;
export type { WorkflowLocator };
