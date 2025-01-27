import type ParamsDictionary from "./ParamsDictionary";

type RequestContext = {
	[key: string]: ParamsDictionary;
};

export default RequestContext;
