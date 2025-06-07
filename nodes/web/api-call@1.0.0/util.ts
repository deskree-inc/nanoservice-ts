import type { JsonLikeObject } from "@blok-ts/runner";

export const runApiCall = async (
	url: string,
	method: string,
	headers: JsonLikeObject,
	body: JsonLikeObject,
	responseType: string,
): Promise<string | JsonLikeObject> => {
	const options: {
		method: string;
		headers: JsonLikeObject;
		redirect: "follow";
		responseType: string;
		body: string | undefined;
	} = {
		method,
		headers,
		redirect: "follow",
		responseType,
		body: typeof body === "string" ? body : JSON.stringify(body),
	};

	if (method === "GET") options.body = undefined;
	const response: Response = await fetch(url, options as RequestInit);

	if (response.status >= 400 && response.ok === false) {
		throw new Error(response.statusText);
	}

	let parsedResponse: string | JsonLikeObject;
	if (response.headers.get("content-type")?.includes("application/json")) {
		parsedResponse = await response.json();
	} else {
		parsedResponse = await response.text();
	}

	return parsedResponse;
};
