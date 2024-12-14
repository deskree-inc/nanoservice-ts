import type {
	BlueprintContext,
	LoggerContext,
} from "@deskree/blueprint-shared";
import DefaultLogger from "./DefaultLogger";
import type Config from "./types/Config";

abstract class ResolverBase {
	abstract get(name: string): Promise<Config>;

	createContext(logger?: LoggerContext): BlueprintContext {
		const ctx: BlueprintContext = {
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
