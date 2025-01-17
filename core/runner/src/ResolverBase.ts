import type { Context, GlobalLogger } from "@nanoservice-ts/shared";
import DefaultLogger from "./DefaultLogger";
import type Config from "./types/Config";
import type { WorkflowLocator } from "./types/GlobalOptions";

abstract class ResolverBase {
	abstract get(name: string, workflow: WorkflowLocator): Promise<Config>;

	createContext(logger?: GlobalLogger): Context {
		const ctx: Context = {
			id: "",
			config: {},
			request: { body: {} },
			response: { data: "", contentType: "", success: true, error: null },
			error: { message: [] },
			logger: logger || new DefaultLogger(),
			eventLogger: null,
			_PRIVATE_: null,
		};

		return ctx;
	}
}

export default ResolverBase;
