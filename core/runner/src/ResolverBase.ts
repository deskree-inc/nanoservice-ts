import type {
	BlueprintContext,
	LoggerContext,
} from "@deskree/blueprint-shared";
import DefaultLogger from "./DefaultLogger";

abstract class ResolverBase {
	abstract get(name: string): Promise<string | undefined>;

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
