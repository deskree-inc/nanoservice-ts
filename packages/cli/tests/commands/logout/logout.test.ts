import { expect, test } from "vitest";
import { logout } from "../../../src/commands/logout";

test("logout", async () => {
	expect(async () => await logout({ token: "test" })).not.toThrow();
});
