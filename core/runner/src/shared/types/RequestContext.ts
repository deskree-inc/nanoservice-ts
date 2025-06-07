import type ParamsDictionary from "../../types/ParamsDictionary";

type RequestContext = {
	[key: string]: ParamsDictionary;
};

export default RequestContext;
