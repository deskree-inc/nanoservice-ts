const node_file = `
import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import type { NodeBase } from "@nanoservice-ts/shared";
import ExampleNodes from "./nodes/examples";

const nodes: {
	[key: string]: NodeBase;
} = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	...ExampleNodes,
};

export default nodes;
`;

const package_dependencies = {
	ai: "^4.1.50",
	"@ai-sdk/openai": "^1.2.0",
	ejs: "^3.1.10",
	pg: "^8.13.3",
	mongodb: "^6.14.2",
};

const package_dev_dependencies = {
	"@types/ejs": "^3.1.5",
	"@types/pg": "^8.11.11",
};

const examples_url = `
Examples:
1- Open "workflow-docs.json" in your browser at http://localhost:4000/workflow-docs
2- Open "db-manager.json" in your browser at http://localhost:4000/db-manager
3- Open "dashboard-gen.json" in your browser at http://localhost:4000/dashboard-gen
4- Open "countries.json" in your browser at http://localhost:4000/countries

For more documentation, visit src/nodes/examples/README.md. The first three examples require a PostgreSQL database to function.
`;

export { node_file, package_dependencies, package_dev_dependencies, examples_url };
