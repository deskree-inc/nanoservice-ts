import { type Context, NodeBase, type ResponseContext, type Step } from "./shared";

export default abstract class RunnerNode extends NodeBase implements Step {
	public node = "";
	public type = "";

	abstract run(ctx: Context): Promise<ResponseContext>;
}
