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

const python3_file = `
from core.nanoservice import NanoService
from core.types.context import Context
from core.types.nanoservice_response import NanoServiceResponse
from core.types.global_error import GlobalError
from typing import Any, Dict
import traceback

class Node(NanoService):
    def __init__(self):
        NanoService.__init__(self)
        self.input_schema = {}
        self.output_schema = {}

    async def handle(self, ctx: Context, inputs: Dict[str, Any]) -> NanoServiceResponse:
        response = NanoServiceResponse()

        try:
            response.setSuccess({ "message": "Hello World from Python3!" })
        except Exception as error:
            err = GlobalError(error)
            err.setCode(500)
            err.setName(self.name)

            stack_trace = traceback.format_exc()
            err.setStack(stack_trace)
            response.success = False
            response.setError(err)

        return response
`;

const examples_url = `
Examples:
1- Open "workflow-docs.json" in your browser at http://localhost:4000/workflow-docs
2- Open "db-manager.json" in your browser at http://localhost:4000/db-manager
3- Open "dashboard-gen.json" in your browser at http://localhost:4000/dashboard-gen
4- Open "countries.json" in your browser at http://localhost:4000/countries

For more documentation, visit src/nodes/examples/README.md. The first three examples require a PostgreSQL database to function.
`;

const workflow_template = `
{
	"name": "",
	"description": "",
	"version": "1.0.0",
	"trigger": {
		"http": {
			"method": "GET",
			"path": "/",
			"accept": "application/json"
		}
	},
	"steps": [
		{
			"name": "node-name",
			"node": "node-module-name",
			"type": "module"
		}
	],
	"nodes": {
		"name": {
			"inputs": {

			}
		}
	}
}
`;

export { node_file, package_dependencies, package_dev_dependencies, python3_file, examples_url, workflow_template };
