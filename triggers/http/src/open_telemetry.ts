import { Resource } from "@opentelemetry/resources";
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

const resource = Resource.default().merge(
	new Resource({
		[ATTR_SERVICE_NAME]: "trigger-http",
		[ATTR_SERVICE_VERSION]: "0.0.8",
	}),
);

const provider = new WebTracerProvider({
	resource: resource,
});
const exporter = new ConsoleSpanExporter();
const processor = new BatchSpanProcessor(exporter);
provider.addSpanProcessor(processor);

provider.register();
