import fs from "node:fs";
import path from "node:path";
import { beforeAll, expect, test } from "vitest";
import Node from "../index";
import ctx from "./helper";

let node: Node;
let rootDir: string;

beforeAll(() => {
	node = new Node();
	node.name = "api-call";
	rootDir = path.resolve(__dirname, ".");
});

// Validate Hello World from Node
test("Render index.html page", async () => {
	const response = await node.handle(ctx(), { react_app: "./dist/app/index.merged.min.js" });
	const mockup_file = path.resolve(rootDir, "index.mockup.html");
	const message: string = fs.readFileSync(mockup_file, "utf8");

	expect(response.success).toEqual(true);
	expect(response.data).toEqual(message);
});
