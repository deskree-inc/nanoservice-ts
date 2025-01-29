import _ from "lodash";
import type Context from "../types/Context";
import type FunctionContext from "../types/FunctionContext";
import type ParamsDictionary from "../types/ParamsDictionary";
import type VarsContext from "../types/VarsContext";

class Mapper {
	public replaceObjectStrings(obj: ParamsDictionary, ctx: Context, data: ParamsDictionary) {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];
				if (typeof value === "string") {
					obj[key] = this.replaceString(value, ctx, data);
				} else if (typeof value === "object") {
					this.replaceObjectStrings(value, ctx, data);
				}
			}
		}
	}

	public replaceString = (strData: string, ctx: Context, data: ParamsDictionary) => {
		let str = strData;

		if (str.length > 1000) {
			throw new Error("Input too long");
		}
		const regex = /\${(.*?)}/g;
		const matches = str.match(regex);

		if (matches) {
			for (const match of matches) {
				try {
					const key = match.replace(/\${/g, "").replace(/}/g, "");
					const value = _.get(data, key) || this.runJs(key, ctx, data);
					// if (value) str = this.parseBasedOnType(str.replace(match, value), typeof value);
					str = str.replace(match, value as string);
				} catch (e) {
					console.log("Mapper Error 1", e);
				}
			}
		}
		const result = this.jsMapper(str, ctx, data) as string;
		return result;
	};

	private runJs(
		str: string,
		ctx: Context,
		data: ParamsDictionary = {},
		func: FunctionContext = {},
		vars: VarsContext = {},
	): ParamsDictionary {
		return Function("ctx", "data", "func", "vars", `"use strict";return (${str});`)(ctx, data, func, vars);
	}

	private jsMapper(str: string, ctx: Context, data: ParamsDictionary): ParamsDictionary | string {
		try {
			if (typeof str === "string" && str.startsWith("js/")) {
				const fn = str.replace("js/", "");
				return this.runJs(fn, ctx, data, ctx.func, ctx.vars);
			}
		} catch (error) {
			console.log("Mapper Error 2", error);
		}
		return str;
	}
}

export default new Mapper();
