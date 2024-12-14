import type Node from "./types/Node";

export default abstract class RunnerNodeBase implements Node {
	[key: string]:
		| import(".").Flow
		| import(".").Properties
		| import(".").Conditions
		| import(".").Condition
		| import("./types/Mapper").default
		| import("./types/TryCatch").default;
}
