import { expect, test } from "vitest";
import { login } from "../../../src/commands/login";

test("login", async () => {
	expect(async () => await login({ token: "test" })).not.toThrow();
});
