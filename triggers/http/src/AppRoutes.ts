/**
 * Express router instance used to define application routes.
 *
 * @remarks
 * This router is currently empty. You can create routes by using methods like `router.get`, `router.post`, etc.
 * Example:
 * ```typescript
 * router.get('/example', (req, res) => {
 *   res.send('Example route');
 * });
 * ```
 *
 * @module AppRoutes
 */

import express from "express";
const router: express.Router = express.Router();

router.get("/", (_, res) => {
	const html = `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Welcome to nanoservice-ts</title>
		<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
		<style>
			body { font-family: 'Inter', sans-serif; }
		</style>
	</head>
	<body class="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
		<main class="flex-grow flex items-center justify-center px-4">
			<div class="max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
				<h1 class="text-3xl font-semibold mb-6 text-center text-blue-700">🚀 Welcome to <span class="text-black">nanoservice-ts</span></h1>
				<p class="text-lg mb-4">You're ready to start building fast and modular applications. Here's how to get started:</p>
				<ol class="list-decimal list-inside mb-6 space-y-2 text-base text-gray-700">
					<li><strong>Create</strong> a new <strong>node</strong> using <code class="bg-gray-100 px-2 py-1 rounded">npx blokctl@latest create node</code>.</li>
					<li><strong>Create</strong> a new <strong>workflow</strong> using <code class="bg-gray-100 px-2 py-1 rounded">npx blokctl@latest create workflow</code>.</li>
					<li><strong>Extend</strong> the routing system in <code class="bg-gray-100 px-2 py-1 rounded">src/AppRoutes.ts</code> to expose new logic.</li>
					<li><strong>Initialize</strong> the metrics stack with Prometheus using <code class="bg-gray-100 px-2 py-1 rounded">docker compose -f infra/metrics/docker-compose.yml up</code>.</li>
					<li><strong>Start</strong> the Docker development environment by running <code class="bg-gray-100 px-2 py-1 rounded">npm run infra:dev</code>.</li>
					<li><strong>Start</strong> the TypeScript watcher to regenerate the dist folder by running <code class="bg-gray-100 px-2 py-1 rounded">npm run infra:build</code>.</li>
					<li><strong>Monitor</strong> built-in performance metrics with <code class="bg-gray-100 px-2 py-1 rounded">npx blokctl@latest monitor</code>.</li>
				</ol>

				<div class="mt-8 text-center">
					<a href="https://blok.build/" target="_blank" class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">Explore Docs</a>
				</div>
			</div>
		</main>

		<footer class="text-center text-sm text-gray-500 py-4">
			<p>Made with ❤️ by the <a href="https://deskree.com/" target="_blank" class="text-blue-600 hover:underline">Deskree</a> team.</p>
		</footer>
	</body>
	</html>
	`;

	res.status(200).send(html);
});

export default router;
