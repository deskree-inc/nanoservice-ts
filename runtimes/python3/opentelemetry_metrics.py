from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.prometheus import PrometheusMetricReader
from opentelemetry.sdk.resources import Resource
from opentelemetry.semconv.resource import ResourceAttributes
from prometheus_client import start_http_server
import logging

# Set up logging
logger = logging.getLogger("metrics")
logging.basicConfig(level=logging.INFO)

# Define resource attributes
resource = Resource(attributes={
    ResourceAttributes.SERVICE_NAME: "python-runner",
    ResourceAttributes.SERVICE_VERSION: "0.0.1",
})

# Initialize PrometheusMetricReader
reader = PrometheusMetricReader()

# Set up MeterProvider with the PrometheusMetricReader
provider = MeterProvider(resource=resource, metric_readers=[reader])
metrics.set_meter_provider(provider)

# Start Prometheus client HTTP server
start_http_server(port=9092)

# Create a meter and a counter
meter = metrics.get_meter(__name__)
counter = meter.create_counter(
    name="example_counter",
    description="An example counter",
    unit="1"
)

# Record a metric
counter.add(1)

logger.info("Prometheus metrics server started on port 9092")
