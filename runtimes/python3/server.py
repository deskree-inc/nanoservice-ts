import json
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

            error_message = {
                "error": str(e),
                "stack": stack_trace
            }

            # Check if the exception message is a valid JSON
            if isinstance(e, Exception):
                try:
                    error_message = json.loads(str(e))
                except json.JSONDecodeError:
                    pass

            encode_error = encode_message(error_message, "JSON")
            return node_pb2.NodeResponse(Message=encode_error, Encoding="BASE64", Type="JSON")

# Start the server
async def serve():
    server = grpc.aio.server()
    node_pb2_grpc.add_NodeServiceServicer_to_server(NodeService(), server)

    port = os.getenv("SERVER_PORT", "50051")
    server.add_insecure_port(f"0.0.0.0:{port}")

    print(f"Server started on port {port}...")

    try:
        await server.start()
        await server.wait_for_termination()
    except asyncio.CancelledError:
        print("\nServer shutdown requested...")
    finally:
        await server.stop(grace=3)  # Graceful shutdown
        print("Server stopped cleanly.")

if __name__ == "__main__":
    try:
        asyncio.run(serve())
    except KeyboardInterrupt:
        print("KeyboardInterrupt detected. Shutting down...")