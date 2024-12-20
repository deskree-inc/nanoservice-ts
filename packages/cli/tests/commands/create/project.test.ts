import { expect, test } from "vitest";
import { createProject } from "../../../dist/commands/create/project";

test("create project", async () => {
	expect(async () => await createProject({ name: "default-node" })).not.toThrow();
});
