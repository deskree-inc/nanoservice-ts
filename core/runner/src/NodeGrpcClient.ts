import { type Transport, createClient } from "@connectrpc/connect";
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createConnectTransport } from "@connectrpc/connect-node";
import { createGrpcWebTransport } from "@connectrpc/connect-node";
import { type NodeRequest, type NodeResponse, NodeService } from "./gen/node_pb";

export type RpcOptions = {
	host: string;
	port: number;
	protocol: string;
	httpVersion: HttpVersionEnum;
	transport: TransportEnum;
};

export type CallOptions = {
	headers: Record<string, string>;
};

export enum TransportEnum {
	GRPC = "grpc",
	GRPC_WEB = "grpc-web",
	CONNECT = "connect",
}

export enum HttpVersionEnum {
	HTTP1 = "1.1",
	HTTP2 = "2",
}

export type { NodeRequest, NodeResponse };

export default class NodeGrpcClient {
	protected opts: RpcOptions;

	constructor(host = "localhost", port = 50051) {
		this.opts = {
			host: host,
			port: port,
			protocol: "http",
			httpVersion: HttpVersionEnum.HTTP2,
			transport: TransportEnum.GRPC,
		};
	}

	async call(message: NodeRequest, opts?: CallOptions): Promise<NodeResponse> {
		const transport = this.transport();
		const client = createClient(NodeService, transport);
		const callResponse = await client.executeNode(message, opts);
		return callResponse;
	}

	transport(): Transport {
		switch (this.opts.transport) {
			case TransportEnum.GRPC:
				return createGrpcTransport({
					baseUrl: `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/`,
					interceptors: [],
					defaultTimeoutMs: 2000,
				});
			case TransportEnum.GRPC_WEB:
				return createGrpcWebTransport({
					baseUrl: `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/`,
					httpVersion: this.opts.httpVersion,
					interceptors: [],
				});
			case TransportEnum.CONNECT:
				return createConnectTransport({
					baseUrl: `${this.opts.protocol}://${this.opts.host}:${this.opts.port}/`,
					httpVersion: this.opts.httpVersion,
					interceptors: [],
				});
			default:
				throw new Error("Invalid transport type");
		}
	}
}

// let client = new FetchGrpc({
//     host: "localhost",
//     port: 8433,
//     protocol: "http",
//     httpVersion: HttpVersionEnum.HTTP2,
//     transport: TransportEnum.GRPC,
// });

// client.call({
//     "Name": "countries",
//     "Message": "ewogICAgInJlcXVlc3QiOiB7CiAgICAgICAgImJvZHkiOiB7CiAgICAgICAgICAgICJjb3VudHJ5X25hbWUiOiAiQ2FuYWRhIgogICAgICAgIH0KICAgIH0KfQ==",
//     "Encoding": "BASE64",
//     "Type": "JSON"
// } as WorkflowRequest).then((response) => {
//     console.log(response);
// }).catch((error) => {
//     console.error(error);
// });
