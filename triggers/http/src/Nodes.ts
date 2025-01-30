import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import MastraAgent from "./nodes/examples/mastra-agent";
import ReactJS from "./nodes/examples/react-js";
import ErrorNode from "./nodes/examples/react-js/ext";
import type Nodes from "./types/Nodes";

const nodes: Nodes = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	"mastra-agent": new MastraAgent(),
	"react-js": new ReactJS(),
	"error-node": new ErrorNode(),
};

export default nodes;
