export const NANOSERVICE_URL =
	process.env.NANOSERVICE_DEV === "true"
		? "https://runner-dev.dac-us-east-1.deskree.com/public/deployment"
		: "https://runner.dac-us-east-1.deskree.com/public/deployment";
