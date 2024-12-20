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
	expect({ message: "Hello World from Node!" }, response.data);
});
