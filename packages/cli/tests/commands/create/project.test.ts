import { expect, test } from "vitest";
import { createProject } from "../../../src/commands/create/project";

test("create project", async () => {
	expect(async () => await createProject({ name: "default-node" })).not.toThrow();
});
