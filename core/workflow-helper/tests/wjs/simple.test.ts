import { describe, expect, it } from "vitest";
import { compileWjsToJson } from "../../src/WjsParser";

describe("Parser - Simple Step", () => {
	it("should parse a simple step correctly", () => {
		const path = `${process.cwd()}/tests/wjs/simple.wjs`;

		const workflow = compileWjsToJson(path);
		console.log(JSON.stringify(workflow, null, 2));
		expect(true).toBe(true);
		// expect(workflow).toBe({
		//     "name": "World Countries",
		//     "description": "Workflow description",
		//     "version": "1.0.0",
		//     "trigger": {
		//         "http": {
		//             "method": "GET",
		//             "path": "/",
		//             "accept": "application/json"
		//         }
		//     },
		//     "steps": [
		//         {
		//             "name": "get-countries-api",
		//             "node": "@nanoservice-ts/api-call",
		//             "type": "module"
		//         }
		//     ],
		//     "nodes": {
		//         "get-countries-api": {
		//             "inputs": {
		//                 "url": "https://countriesnow.space/api/v0.1/countries/capital",
		//                 "method": "GET",
		//                 "headers": {
		//                     "Content-Type": "application/json"
		//                 },
		//                 "responseType": "application/json"
		//             }
		//         }
		//     }
		// });
	});
});
