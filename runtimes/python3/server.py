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

from opentelemetry_traces import tracer
from opentelemetry_metrics import metrics as otelmetrics
from util.metrics.main import Metrics


# Implement the service
class NodeService(node_pb2_grpc.NodeServiceServicer):
    async def ExecuteNode(self, request, context):
        
        node_error = otelmetrics.get_meter("default").create_counter(
            name="node_error_counter",
            description="Count of node errors"
        )
        node_success = otelmetrics.get_meter("default").create_counter(
            name="node_success_counter",
            description="Count of node successes"
        )
        metrics = Metrics()

        with tracer.start_as_current_span("NodeService.ExecuteNode") as span:
            # Set attributes for the span
            span.set_attribute("node_name", request.Name)
            try:
                # Start the metrics
                metrics.start()
        
                # Decode the message
                name = request.Name
                context: Context = decode_message(request)

                # Run the node
                runner = Runner(name, context)

                response = await runner.run()
                encode_response = encode_message(response, "JSON")

                node_success.add(1, {"node_name": request.Name})
                return node_pb2.NodeResponse(Message=encode_response, Encoding="BASE64", Type="JSON")
            except Exception as e:
                # Increment the error counter
                node_error.add(1, {"node_name": request.Name})
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
            finally:
                # Stop the metrics
                metrics.stop()

                # Get the metrics
                metrics_data = metrics.get_metrics()
                
                # Add the metrics to the span
                span.set_attribute("metrics", metrics_data)

                # clear the metrics
                metrics.clear()

# Start the server
async def serve():
    server = grpc.aio.server()
    node_pb2_grpc.add_NodeServiceServicer_to_server(NodeService(), server)

    port = os.getenv("SERVER_PORT", "50051")
    server.add_insecure_port(f"0.0.0.0:{port}")

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