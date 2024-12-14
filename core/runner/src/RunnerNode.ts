import {
	type BlueprintContext,
	BlueprintNode,
	type ResponseContext,
	type Step,
} from "@deskree/blueprint-shared";

export default abstract class RunnerNode extends BlueprintNode implements Step {
	public node = "";
	public type = "";

	abstract run(ctx: BlueprintContext): Promise<ResponseContext>;
}
