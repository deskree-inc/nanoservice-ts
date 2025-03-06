import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import type { NodeBase } from "@nanoservice-ts/shared";
import ArrayMapNode from "./nodes/examples/dashboard-generator/ArrayMap";
import DashboardChartsGenerator from "./nodes/examples/dashboard-generator/DashboardChartsGenerator";
import MemoryStorage from "./nodes/examples/dashboard-generator/MemoryStorage";
import MultipleQueryGeneratorNode from "./nodes/examples/dashboard-generator/MultipleQueryGeneratorNode";
import DashboardGeneratorUI from "./nodes/examples/dashboard-generator/ui";
import MapperNode from "./nodes/examples/db-manager/MapperNode";
import QueryGeneratorNode from "./nodes/examples/db-manager/QueryGeneratorNode";
import DatabaseUI from "./nodes/examples/db-manager/ui";
import PostgresQuery from "./nodes/examples/postgres-query";
import DirectoryManager from "./nodes/examples/workflow-docs/DirectoryManager";
import ErrorNode from "./nodes/examples/workflow-docs/ErrorNode";
import FileManager from "./nodes/examples/workflow-docs/FileManager";
import OpenAI from "./nodes/examples/workflow-docs/OpenAI";
import WorkflowUI from "./nodes/examples/workflow-docs/ui";

const nodes: {
	[key: string]: NodeBase;
} = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	"directory-manager": new DirectoryManager(),
	openai: new OpenAI(),
	error: new ErrorNode(),
	"file-manager": new FileManager(),
	"workflow-ui": new WorkflowUI(),
	"database-ui": new DatabaseUI(),
	"postgres-query": new PostgresQuery(),
	"query-generator": new QueryGeneratorNode(),
	mapper: new MapperNode(),
	"dashboard-ui": new DashboardGeneratorUI(),
	"multiple-query-generator": new MultipleQueryGeneratorNode(),
	"array-map": new ArrayMapNode(),
	"dashboard-charts-generator": new DashboardChartsGenerator(),
	"memory-storage": new MemoryStorage(),
};

export default nodes;
