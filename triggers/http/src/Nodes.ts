import ApiCall from "@blok-ts/api-call";
import IfElse from "@blok-ts/if-else";
import type { NodeBase } from "@blok-ts/runner";
import Examples from "./nodes/examples";

const nodes: {
	[key: string]: NodeBase;
} = {
	"@blok-ts/api-call": new ApiCall(),
	"@blok-ts/if-else": new IfElse(),
	...Examples,
};

export default nodes;
