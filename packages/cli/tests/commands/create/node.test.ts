import { expect, test } from "vitest";
import { createNode } from "../../../src/commands/create/node";

test("create node", async () => {
	expect(async () => await createNode({ name: "default-node" })).not.toThrow();
});
