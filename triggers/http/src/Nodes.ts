import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import React from "@nanoservice-ts/react";
import type Nodes from "./types/Nodes";

const nodes: Nodes = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	"@nanoservice-ts/react": new React(),
};

export default nodes;
