import type { CallOptions, NodeRequest, NodeResponse } from "./NodeGrpcClient";
import type ParamsDictionary from "./types/ParamsDictionary";

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(`${__dirname}/proto/node.proto`, {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
});
const nodeProto = grpc.loadPackageDefinition(packageDefinition);

type RpcOptions = {
	host: string;
	port: number;
};

export default class NodeGrpcNativeClient {
	protected opts: RpcOptions;

	constructor(host = "localhost", port = 50051) {
		this.opts = {
			host: host,
			port: port,
		};
	}

	async call(message: NodeRequest, opts?: CallOptions): Promise<NodeResponse> {
		const response = await this.executeNode(message);
		return response as unknown as NodeResponse;
	}

	executeNode(message: NodeRequest): Promise<ParamsDictionary> {
		return new Promise((resolve, reject) => {
			const client = new nodeProto.nanoservice.workflow.v1.NodeService(
				`${this.opts.host}:${this.opts.port}`,
				grpc.credentials.createInsecure(),
				{
					"grpc.keepalive_time_ms": 10000, // Keep connection alive every 10s
					"grpc.keepalive_timeout_ms": 5000,
				},
			);

			client.ExecuteNode(message, (error: Error, response: ParamsDictionary) => {
				if (error) {
					reject(error);
				} else {
					resolve(response);
				}
			});
		});
	}
}
