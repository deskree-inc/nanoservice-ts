import { BlueprintNode } from "@deskree/blueprint-shared";
import { z } from "zod";
import ConfigurationResolver from "./ConfigurationResolver";
import type RunnerNode from "./RunnerNode";
import type RunnerNodeBase from "./RunnerNodeBase";
import type Condition from "./types/Condition";
import type Config from "./types/Config";
import type Flow from "./types/Flow";
import type Mapper from "./types/Mapper";
import type Node from "./types/Node";
import type Trigger from "./types/Trigger";
import type TryCatch from "./types/TryCatch";

export default class Configuration implements Config {
	public workflow: Config = <Config>{};
	public name: string;
	public version: string;
	public steps: BlueprintNode[];
	public nodes: Node;
	public trigger: Trigger;
	public static loaded_nodes: Node = <Node>{};

	constructor() {
		this.steps = [];
		this.nodes = <Node>{};
		this.version = "";
		this.name = "";
		this.trigger = {};
	}

	public async init(workflowNameInPath: string) {
		try {
			if (workflowNameInPath === undefined)
				throw new Error("Workflow name must be provided");
			const resolver = new ConfigurationResolver();

			this.workflow = await resolver.get("local", workflowNameInPath as string);

			if (!this.workflow)
				throw new Error(`No workflow found with path '${workflowNameInPath}'`);

			this.steps = await this.getSteps(this.workflow.steps as RunnerNode[]);
			this.nodes = await this.getNodes(this.workflow.nodes);
			this.version = this.workflow.version;
			this.name = this.workflow.name;
			this.trigger = this.workflow.trigger;
		} catch (err) {
			console.log(err);
			throw err;
		}
	}

	protected async getSteps(
		blueprint_steps: RunnerNode[],
	): Promise<BlueprintNode[]> {
		const nodes: RunnerNode[] = [];

		if (blueprint_steps === undefined) {
			throw new Error("Blueprint must have at least one step");
		}
		if (blueprint_steps.length === 0) {
			throw new Error("Blueprint must have at least one step");
		}

		for (let i = 0; i < blueprint_steps.length; i++) {
			const step: RunnerNode = blueprint_steps[i];
			const node: RunnerNode = await this.nodeResolver(step);

			const validator = z.instanceof(BlueprintNode);
			validator.parse(node);
			node.node = step.node;
			node.name = step.name;
			node.active = step.active !== undefined ? step.active : true;
			node.stop = step.stop !== undefined ? step.stop : false;
			// node.runSteps = this.runSteps;
			nodes.push(node);
		}

		return nodes;
	}

	protected async getNodes(blueprint_nodes: Node): Promise<Node> {
		const nodes: Node = <Node>{};

		if (blueprint_nodes !== undefined) {
			const keys = Object.keys(blueprint_nodes);

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const currentNode = blueprint_nodes[key] as RunnerNodeBase;

				const isFlow =
					currentNode.steps !== undefined && Array.isArray(currentNode.steps);
				const isConditions =
					currentNode.conditions !== undefined &&
					Array.isArray(currentNode.conditions);
				const isFlowWithProperties =
					isFlow && Object.keys(blueprint_nodes[key]).length > 1;
				const hasOutputs = currentNode.mapper !== undefined;

				if (isFlowWithProperties) {
					const steps = currentNode.steps as unknown as RunnerNode[];
					nodes[key] = await this.getFlow(steps);
					const copyBlueprintNode = {
						...blueprint_nodes[key],
					} as RunnerNodeBase;
					(copyBlueprintNode as unknown as Flow).steps = [];
					nodes[key] = { ...nodes[key], ...copyBlueprintNode };
				} else if (isFlow) {
					const steps = currentNode.steps as unknown as RunnerNode[];
					nodes[key] = await this.getFlow(steps);
				} else if (isConditions) {
					const conditions = currentNode.conditions as unknown as Condition[];
					for (let j = 0; j < conditions.length; j++) {
						const condition = conditions[j];
						const steps = condition.steps as unknown as RunnerNode[];
						conditions[j].steps = (await this.getFlow(steps)).steps;
					}

					nodes[key] = { conditions };
				} else if (
					typeof blueprint_nodes[key] === "object" &&
					currentNode.try &&
					(currentNode.try as unknown as Flow).steps &&
					currentNode.catch &&
					(currentNode.catch as unknown as Flow).steps
				) {
					(nodes[key] as TryCatch) = {
						try: await this.getFlow((currentNode.try as unknown as Flow).steps),
						catch: await this.getFlow(
							(currentNode.catch as unknown as Flow).steps,
						),
					};
				} else {
					nodes[key] = { ...blueprint_nodes[key] };
				}

				// Resolves the internal mapper
				if (hasOutputs) {
					const step: RunnerNode = currentNode.mapper as unknown as RunnerNode;
					if (
						typeof step === "object" &&
						step.name &&
						step.node &&
						step.type &&
						step.node.startsWith("mapper@")
					) {
						(nodes[key] as Mapper).mapper = (
							await this.getFlow([step])
						).steps[0];
					}
				}
			}
		}

		return nodes;
	}

	protected async getFlow(steps: RunnerNode[]): Promise<Flow> {
		const flows: Flow = {
			steps: [],
		};

		for (let j = 0; j < steps.length; j++) {
			const step: RunnerNode = steps[j];
			const node: RunnerNode = await this.nodeResolver(step);
			node.node = step.node;
			node.name = step.name;
			node.active = step.active !== undefined ? step.active : true;
			node.stop = step.stop !== undefined ? step.stop : false;

			const validator = z.instanceof(BlueprintNode);
			validator.parse(node);
			flows.steps.push(node);
		}

		return flows;
	}

	// protected async runSteps(steps: BlueprintNode[], ctx: BlueprintContext) {
	//     let runner = new Runner(ctx.config, steps);
	//     return (await runner.run(ctx)).response.data;
	// }

	protected async nodeResolver(node: RunnerNode): Promise<RunnerNode> {
		const path = `${process.env.NODES_PATH}/${node.node}`;
		console.log("NODES_PATH", path);
		return new (await import(path)).default() as Promise<RunnerNode>;
	}
}
