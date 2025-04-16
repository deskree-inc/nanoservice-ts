prepare:
	echo VITE_WORKFLOWS_PATH=${PWD}/triggers/http/workflows > ${PWD}/core/runner/.env.local
	echo VITE_NODES_PATH=${PWD}/triggers/http/src/nodes >> ${PWD}/core/runner/.env.local

cli-dev:
	pnpm --filter nanoctl -r run dev