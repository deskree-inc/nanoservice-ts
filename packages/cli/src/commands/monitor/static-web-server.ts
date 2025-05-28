import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import open from "open";
// @ts-ignore
import serveHandler from "serve-handler";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let signalHandlerRegistered = false;

export default async function startWebMonitorUI(host?: string, token?: string) {
	const staticPath = path.join(__dirname, "./static");
	const port = 4040;

	if (!fs.existsSync(staticPath)) {
		console.error(`❌ Static path not found: ${staticPath}`);
		process.exit(1);
	}

	const server = http.createServer((req, res) => {
		handleRequest(req, res, host, token, staticPath);
	});

	server.listen(port, async () => {
		const url = `http://localhost:${port}`;
		console.log(`📂 Serving UI from: ${staticPath}`);
		console.log(`🧪 Monitor UI available at: ${url}`);
		await open(url);
	});

	const stop = () => {
		server.close(() => {
			console.log("🛑 Monitor UI server stopped.");
			process.exit(0);
		});
	};

	if (!signalHandlerRegistered) {
		const signals = ["SIGQUIT", "SIGHUP"];
		for (const signal of signals) {
			process.once(signal, stop);
		}
		signalHandlerRegistered = true;
	}
}

function handleRequest(
	req: http.IncomingMessage,
	res: http.ServerResponse,
	host: string | undefined,
	token: string | undefined,
	staticPath: string,
) {
	const url = req.url || "/";
	const parsedUrl = new URL(url, `http://${req.headers.host}`);
	const isRootOrIndex = parsedUrl.pathname === "/" || parsedUrl.pathname.startsWith("/index.html");

	// Proxy Prometheus API calls
	if (parsedUrl.pathname.startsWith("/api/metrics")) {
		if (!host) {
			res.writeHead(400, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Missing Prometheus host." }));
			return;
		}

		let query_path = "query_range";

		if (req.headers["x-table"]) {
			query_path = "query";
		}

		const proxiedUrl = `${host}/api/v1/${query_path}${parsedUrl.search}`;
		const isSecure = host.startsWith("https://");
		const httpModule = isSecure ? https : http;

		const proxyReq = httpModule.request(
			proxiedUrl,
			{
				method: "GET",
				headers: {
					...(token ? { Authorization: `Bearer ${token}` } : {}),
					Accept: "application/json",
					"Accept-Encoding": "identity",
				},
			},
			(proxyRes) => {
				res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
				proxyRes.pipe(res, { end: true });
			},
		);

		proxyReq.on("error", (err) => {
			console.error("Proxy error:", err);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "Failed to proxy Prometheus request." }));
		});

		proxyReq.end();
		return;
	}

	// Serve static files
	if (isRootOrIndex || parsedUrl.pathname.endsWith(".js") || parsedUrl.pathname.endsWith(".css")) {
		return serveHandler(req, res, {
			public: staticPath,
			cleanUrls: true,
		});
	}

	// Fallback 404
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("404 Not Found");
}
