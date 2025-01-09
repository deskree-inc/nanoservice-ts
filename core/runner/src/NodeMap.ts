import type { BlueprintNode } from "@deskree/blueprint-shared";

export default class NodeMap {
	public nodes: Map<string, BlueprintNode> = new Map<string, BlueprintNode>();

	public addNode(name: string, node: BlueprintNode): void {
		this.nodes.set(name, node);
	}

	public getNode(name: string): BlueprintNode | undefined {
		return this.nodes.get(name);
	}

	public getNodes(): Map<string, BlueprintNode> {
		return this.nodes;
	}
}
