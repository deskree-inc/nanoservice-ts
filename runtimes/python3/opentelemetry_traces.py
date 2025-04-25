from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.semconv.resource import ResourceAttributes

# Define resource attributes
resource = Resource(attributes={
    ResourceAttributes.SERVICE_NAME: "python-runner",
    ResourceAttributes.SERVICE_VERSION: "1.0.0",
})

# Initialize tracer provider with the resource
provider = TracerProvider(resource=resource)

# Create a console span exporter
exporter = ConsoleSpanExporter()

# Create a batch span processor and add it to the provider
processor = BatchSpanProcessor(exporter)
provider.add_span_processor(processor)

# Set the global tracer provider
trace.set_tracer_provider(provider)

# Obtain a tracer
tracer = trace.get_tracer(__name__)


