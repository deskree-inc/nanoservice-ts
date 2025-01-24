import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
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
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const resource = Resource.default().merge(
	new Resource({
		[ATTR_SERVICE_NAME]: "trigger-http",
		[ATTR_SERVICE_VERSION]: "0.0.8",
	}),
);

const LOKI_EXPORTER_ACTIVATED = process.env.LOKI_EXPORTER_ACTIVATED === "true";
const LOKI_EXPORTER_URL = process.env.LOKI_EXPORTER_URL || "http://localhost:3100/otlp";

let exporter: SpanExporter;
let processor: SpanProcessor;

if (LOKI_EXPORTER_ACTIVATED) {
	const collectorOptions = {
		url: LOKI_EXPORTER_URL,
		headers: {},
		concurrencyLimit: 10,
	};

	exporter = new OTLPTraceExporter(collectorOptions);
	processor = new BatchSpanProcessor(exporter);
} else {
	exporter = new ConsoleSpanExporter();
	processor = new BatchSpanProcessor(exporter);

	const provider = new WebTracerProvider({
		resource: resource,
		spanProcessors: [processor],
	});

	provider.register();
}
