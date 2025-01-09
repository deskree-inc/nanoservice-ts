dev-runner:
	pnpm --filter nanoservice-ts-runner --parallel -r run start:dev
dev-http:
	pnpm --filter nanoservice-ts-trigger-http --parallel -r run start:dev
dev-nodes:
	pnpm --filter @nanoservice/if-else --filter @nanoservice/api-call --parallel -r run start:dev