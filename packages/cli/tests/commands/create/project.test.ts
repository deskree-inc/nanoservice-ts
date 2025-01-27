import { expect, test } from "vitest";
import { createProject } from "../../../src/commands/create/project";

test("create project", async () => {
	expect(async () => await createProject({ name: "default-node" })).not.toThrow();
});

test("create path", async () => {
	const env = "WORKFLOWS_PATH=PROJECT_PATH/workflows,NODES_PATH=PROJECT_PATH/src/nodes";
	const path = "/home/ubuntu";
	const result = env.replaceAll("PROJECT_PATH", path);

	expect(result).toBe("WORKFLOWS_PATH=/home/ubuntu/workflows,NODES_PATH=/home/ubuntu/src/nodes");
});
