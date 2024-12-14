import type { BlueprintNode } from "@deskree/blueprint-shared";

type Condition = {
	type?: string;
	condition: string;
	steps?: BlueprintNode[];
	error?: string;
};

export default Condition;
