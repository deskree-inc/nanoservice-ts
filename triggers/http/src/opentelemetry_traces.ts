// import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import {
	BatchSpanProcessor,
	ConsoleSpanExporter,
	type SpanExporter,
	type SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

const resource = Resource.default().merge(
	new Resource({
		[ATTR_SERVICE_NAME]: "trigger-http",
		[ATTR_SERVICE_VERSION]: "0.0.8",
	}),
);

const exporter: SpanExporter = new ConsoleSpanExporter();
const processor: SpanProcessor = new BatchSpanProcessor(exporter);

const provider = new WebTracerProvider({
	resource: resource,
	spanProcessors: [processor],
});

provider.register();
