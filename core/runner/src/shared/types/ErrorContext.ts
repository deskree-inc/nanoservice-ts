import type ParamsDictionary from "../../types/ParamsDictionary";

type ErrorContext = {
	message: string[] | string;
	code?: number;
	json?: ParamsDictionary;
	stack?: string;
	name?: string;
};

export default ErrorContext;
