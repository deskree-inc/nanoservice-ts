import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import type { NodeBase } from "@nanoservice-ts/shared";
import MastraAgent from "./nodes/examples/mastra-agent";
import MongoQuery from "./nodes/examples/mongodb-query";
import PostgresQuery from "./nodes/examples/postgres-query";
import ReactJS from "./nodes/examples/react-js";
import ErrorNode from "./nodes/examples/react-js/ext";

const nodes: {
	[key: string]: NodeBase;
} = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	"mastra-agent": new MastraAgent(),
	"react-js": new ReactJS(),
	"error-node": new ErrorNode(),
	"postgres-query": new PostgresQuery(),
	"mongodb-query": new MongoQuery(),
};

export default nodes;
