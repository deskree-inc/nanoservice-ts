import type { NodeBase } from "./shared";

export default class NodeMap {
	public nodes: Map<string, NodeBase> = new Map<string, NodeBase>();

	public addNode(name: string, node: NodeBase): void {
		this.nodes.set(name, node);
	}

	public getNode(name: string): NodeBase | undefined {
		return this.nodes.get(name);
	}

	public getNodes(): Map<string, NodeBase> {
		return this.nodes;
	}
}
