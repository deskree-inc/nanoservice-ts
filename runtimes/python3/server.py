import grpc.aio # type: ignore
import asyncio
import os
import gen.node_pb2 as node_pb2
import gen.node_pb2_grpc as node_pb2_grpc
from util.message_manager import decode_message, encode_message
from runner import Runner
import traceback
from core.types.context import Context

# Implement the service
class NodeService(node_pb2_grpc.NodeServiceServicer):
    async def ExecuteNode(self, request, context):
        try:
            # Decode the message
            name = request.Name
            context: Context = decode_message(request)

            # Run the node
            runner = Runner(name, context)

            response = await runner.run()
            encode_response = encode_message(response, "JSON")

            return node_pb2.NodeResponse(Message=encode_response, Encoding="BASE64", Type="JSON")
        except Exception as e:
            stack_trace = traceback.format_exc()
            message = str(e) + ", " + stack_trace
            return node_pb2.NodeResponse(Message=message, Encoding="STRING", Type="TEXT")

# Start the server
async def serve():
    server = grpc.aio.server()
    node_pb2_grpc.add_NodeServiceServicer_to_server(NodeService(), server)

    port = os.getenv("SERVER_PORT", "50051")
    server.add_insecure_port(f"[::]:{port}")

    print("Server started on port 50051...")
    await server.start()
    await server.wait_for_termination()

if __name__ == "__main__":
    asyncio.run(serve())