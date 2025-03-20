import ArrayMapNode from "./dashboard-generator/ArrayMap";
import DashboardChartsGenerator from "./dashboard-generator/DashboardChartsGenerator";
import MemoryStorage from "./dashboard-generator/MemoryStorage";
import MultipleQueryGeneratorNode from "./dashboard-generator/MultipleQueryGeneratorNode";
import DashboardGeneratorUI from "./dashboard-generator/ui";
import MapperNode from "./db-manager/MapperNode";
import QueryGeneratorNode from "./db-manager/QueryGeneratorNode";
import DatabaseUI from "./db-manager/ui";
import FeedbackUI from "./feedback-ui";
import MastraAgent from "./mastra-agent";
import WeatherUI from "./mastra-agent/ui";
import MongoQuery from "./mongodb-query";
import PostgresQuery from "./postgres-query";
import DirectoryManager from "./workflow-docs/DirectoryManager";
import ErrorNode from "./workflow-docs/ErrorNode";
import FileManager from "./workflow-docs/FileManager";
import OpenAI from "./workflow-docs/OpenAI";
import WorkflowUI from "./workflow-docs/ui";

const ExampleNodes = {
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
	"weather-ui": new WeatherUI(),
	"mastra-agent": new MastraAgent(),
	"mongo-query": new MongoQuery(),
	"feedback-ui": new FeedbackUI(),
};

export default ExampleNodes;
