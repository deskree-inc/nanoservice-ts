import type ParamsDictionary from "@nanoservice-ts/shared/dist/types/ParamsDictionary";
import { beforeAll, expect, test } from "vitest";
import Node from "../index";
import ctx from "./helper";

let node: Node;

beforeAll(() => {
	node = new Node();
	node.name = "api-call";
});

// Validate Hello World from Node
test("Hello World from Node", async () => {
	const response = await node.handle(ctx(), {});
	const message: ParamsDictionary = { message: "Hello World from Node!" };

	expect(message).toEqual(response.data);
});
