import type { BlueprintNode } from "@deskree/blueprint-shared";
import ApiCall from "@nanoservice/api-call";

const nodes: {
	[key: string]: BlueprintNode;
} = {
	"@nanoservice/api-call": new ApiCall() as BlueprintNode,
};

export default nodes;
