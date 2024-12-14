import type { BlueprintNode, Step } from "@deskree/blueprint-shared";
import type { Request } from "express";
import type { ParamsDictionary } from "nanoservice-ts-runner";

export function validateRoute(dynamicRoute: string, actualRoute: string) {
	if (!dynamicRoute || !actualRoute) return false;
	// Convert dynamicRoute to a regex pattern
	const regexPattern = dynamicRoute
		.replace(/\/:\w+\?/g, "(?:/([^/]+)?)?") // Optional parameter handling
		.replace(/\/:\w+/g, "/([^/]+)")
		.replace(/\*/g, ".*");

	// Create a new RegExp to match the dynamic route pattern
	const dynamicRouteRegExp = new RegExp(`^${regexPattern}$`);
	// Test the actual route against the dynamic route pattern
	return dynamicRouteRegExp.test(actualRoute);
}

export function handleDynamicRoute(
	dynamicRoute: string,
	req: Request,
): ParamsDictionary {
	// Extract the parameter names from the dynamic route pattern
	const paramNames = dynamicRoute
		.match(/:(\w+)/g)
		?.map((name: string) => name.substring(1));
	if (paramNames) {
		// Create a new RegExp to match the dynamic route pattern
		const dynamicRouteRegExp = new RegExp(
			`^${dynamicRoute.replace(/:\w+/g, "([^\\/]+)")}$`,
		);
		// Test the actual route against the dynamic route pattern
		const match = req.path.match(dynamicRouteRegExp);
		if (match) {
			// Extract the parameter values from the actual route
			const params = match.slice(1);
			// Add the parameter names and values to the request object
			paramNames.forEach((name: string | number, index: number) => {
				req.params[name] = params[index];
			});
		} else {
			const params = req.path.split("/");
			const dynamicRouteSplitted = dynamicRoute.split("/");
			dynamicRouteSplitted.forEach((name: string, i: number) => {
				if (name.startsWith(":"))
					req.params[name.replace(":", "").replace("?", "")] = params[i];
			});
		}
	}

	return req.params;
}

export async function nodeResolver(node: Step): Promise<BlueprintNode> {
	return new (await import(node.node)).default() as Promise<BlueprintNode>;
}
