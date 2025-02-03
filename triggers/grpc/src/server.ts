import type { ConnectRouter } from "@connectrpc/connect";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { DefaultLogger } from "@nanoservice-ts/runner";
import GRpcTrigger from "./GRpcTrigger";

async function main() {
	const logger = new DefaultLogger();
	const trigger = new GRpcTrigger();
	const server = trigger.getApp();
	await server.register(fastifyConnectPlugin, {
		routes: (router: ConnectRouter) => trigger.processRequest(router, trigger),
	});
	await server.listen({ host: "localhost", port: 8443 });
	logger.log(`Server is listening at ${JSON.stringify(server.addresses())}`);
}
void main();
