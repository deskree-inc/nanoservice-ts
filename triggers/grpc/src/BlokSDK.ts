import fs from "node:fs";
import type { JsonLikeObject } from "@blok-ts/runner";
import GrpcClient, { type RpcOptions, type WorkflowRequest, HttpVersionEnum, TransportEnum } from "./GrpcClient";
import MessageDecode from "./MessageDecode";

export default class BlokSDK {
	public createClient(host?: string, token?: string) {
		let _host = host || "localhost:8433";
		let _token = token || "";

		if (!host) {
			const app_path = process.cwd();
			// Validate if the file bloksdk.json exists
			if (fs.existsSync(`${app_path}/bloksdk.json`)) {
				const data = fs.readFileSync(`${app_path}/bloksdk.json`, "utf8");
				const json = JSON.parse(data);
				_host = json.host;
				_token = json.token;
			}
		}

		// Validate if the host does not have the format domain:port without http:// or https://
		if (!_host.includes("http://") && !_host.includes("https://")) {
			if (!_host.includes(":")) {
				throw new Error("Invalid host format. The host must have the format domain:port");
			}
		}

		// get host and port
		const host_port = _host.split(":");

		return new BlokSDKClient(
			{
				host: host_port[0] || "localhost",
				port: Number.parseInt(host_port[1]),
				protocol: "http",
				httpVersion: HttpVersionEnum.HTTP2,
				transport: TransportEnum.GRPC,
			},
			_token,
		);
	}
}

export class BlokSDKClient {
	private client: GrpcClient;
	private token: string;

	constructor(options: RpcOptions, token: string) {
		this.client = new GrpcClient(options);
		this.token = token;
	}

	public async python3(nodeName: string, inputs: JsonLikeObject): Promise<JsonLikeObject> {
		const workflow = {
			name: "Remote Node",
			description: "Execution of remote node",
			version: "1.0.0",
			trigger: {
				grpc: {},
			},
			steps: [
				{
					name: "node",
					node: nodeName,
					type: "runtime.python3",
				},
			],
			nodes: {
				node: {
					inputs: inputs,
				},
			},
		};

		const base64Workflow = Buffer.from(JSON.stringify({ request: {}, workflow: workflow })).toString("base64");
		const request: WorkflowRequest = {
			$typeName: "nanoservice.workflow.v1.WorkflowRequest",
			Name: nodeName,
			Message: base64Workflow,
			Encoding: "BASE64",
			Type: "JSON",
		};

		return await this.call(request);
	}

	public async nodejs(nodeName: string, inputs: JsonLikeObject, type = "module"): Promise<JsonLikeObject> {
		const workflow = {
			name: "Remote Node",
			description: "Execution of remote node",
			version: "1.0.0",
			trigger: {
				http: {
					method: "GET",
					path: "/",
					accept: "application/json",
				},
			},
			steps: [
				{
					name: "node",
					node: nodeName,
					type: type,
				},
			],
			nodes: {
				node: {
					inputs: inputs,
				},
			},
		};

		const base64Workflow = Buffer.from(JSON.stringify({ request: {}, workflow: workflow })).toString("base64");
		const request: WorkflowRequest = {
			$typeName: "nanoservice.workflow.v1.WorkflowRequest",
			Name: nodeName,
			Message: base64Workflow,
			Encoding: "BASE64",
			Type: "JSON",
		};

		return await this.call(request);
	}

	protected async call(message: WorkflowRequest): Promise<JsonLikeObject> {
		const response = await this.client.call(message, { headers: { Authorization: `Bearer ${this.token}` } });
		const decode = new MessageDecode();
		const responseDecoded = decode.responseDecode(response);
		return responseDecoded;
	}
}

// const client = new NanoSDK().createClient("127.0.0.1:8433", "");
// client.python3("api_call", {
//     "url": "https://countriesnow.space/api/v0.1/countries/capital",
//     "method": "GET",
//     "headers": {
//         "Content-Type": "application/json"
//     },
//     "responseType": "application/json"
// }).then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.error("ERROR", error);
// });
