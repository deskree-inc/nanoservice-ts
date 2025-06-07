import type GlobalLogger from "../GlobalLogger";
import type ConfigContext from "./ConfigContext";
import type EnvContext from "./EnvContext";
import type ErrorContext from "./ErrorContext";
import type FunctionContext from "./FunctionContext";
import type LoggerContext from "./LoggerContext";
import type RequestContext from "./RequestContext";
import type ResponseContext from "./ResponseContext";
import type VarsContext from "./VarsContext";

type Context = {
	id: string;
	workflow_name?: string;
	workflow_path?: string;
	request: RequestContext;
	response: ResponseContext;
	error: ErrorContext;
	logger: LoggerContext;
	config: ConfigContext;
	func?: FunctionContext;
	vars?: VarsContext;
	env?: EnvContext;
	eventLogger: GlobalLogger | unknown;
	_PRIVATE_: unknown;
};

export default Context;
