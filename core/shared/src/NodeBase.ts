import _ from "lodash";
import GlobalError from "./GlobalError";
import { Metrics } from "./Metrics";
import type Context from "./types/Context";
import type ErrorContext from "./types/ErrorContext";
import type FunctionContext from "./types/FunctionContext";
import type NodeConfigContext from "./types/NodeConfigContext";
import type ParamsDictionary from "./types/ParamsDictionary";
import type ResponseContext from "./types/ResponseContext";
import type Step from "./types/Step";
import type VarsContext from "./types/VarsContext";
import mapper from "./utils/Mapper";

export default abstract class RunnerNode {
	public flow = false;
	public name = "";
	public contentType = "";
	public active = true;
	public stop = false;
	public originalConfig: ParamsDictionary = {};
	private metrics: Metrics;

	constructor() {
		this.metrics = new Metrics();
	}

	public async process(ctx: Context, step?: Step): Promise<ResponseContext> {
		let response: ResponseContext = {
			success: true,
			data: null,
			error: null,
		};

		try {
			const config: NodeConfigContext = ctx.config as unknown as NodeConfigContext;
			this.originalConfig = _.cloneDeep(config[this.name]);
			this.blueprintMapper(config[this.name], ctx);

			this.metrics.start();
			response = await this.run(ctx);
			this.metrics.stop();

			if (response.error) response.success = false;
			ctx.response = response;

			if (step !== undefined) {
				const mapperStep: Step = config[step.name]?.mapper as unknown as Step;
				if (response.success && mapperStep) response = await this.processMapper(mapperStep, ctx, config);
			}
		} catch (error: unknown) {
			response.error = this.setError(error as ErrorContext);
			response.success = false;
			ctx.response = response;
		} finally {
			this.getMetrics().then((metrics) => {
				const duration = metrics.time?.duration || 0;
				ctx.logger.log(`Step (${this.name}) completed in ${duration.toFixed(2)}ms`);
			});
		}

		return response;
	}

	public async processFlow(ctx: Context): Promise<ResponseContext> {
		let response: ResponseContext = {
			success: true,
			data: null,
			error: null,
		};

		try {
			const config: NodeConfigContext = ctx.config as unknown as NodeConfigContext;

			this.blueprintMapper(config[this.name], ctx);

			this.metrics.start();
			response = await this.run(ctx);
			this.metrics.stop();
		} catch (error: unknown) {
			response.error = this.setError(error as ErrorContext);
			response.success = false;
			ctx.response = response;
		} finally {
			this.getMetrics().then((metrics) => {
				const duration = metrics.time?.duration || 0;
				ctx.logger.log(`Step (${this.name}) completed in ${duration.toFixed(2)}ms`);
			});
		}

		return response;
	}

	private async processMapper(step: Step, ctx: Context, config: NodeConfigContext): Promise<ResponseContext> {
		let response: ResponseContext = {
			success: true,
			data: null,
			error: null,
		};

		try {
			if (!step.node.startsWith("mapper")) throw new Error("You must use a mapper node to use the mapper property");

			this.blueprintMapper(config as unknown as ParamsDictionary, ctx);

			response = (await step.run(ctx)) as ResponseContext;
			if (response.error) response.success = false;
		} catch (error: unknown) {
			response.error = this.setError(error as ErrorContext);
			response.success = false;
		}
		return response;
	}

	abstract run(ctx: Context): Promise<ResponseContext>;

	public runSteps(step: Step | Step[], ctx: Context): Promise<Context> {
		console.error("[Error] runSteps method is not implemented.");
		throw new Error("runSteps method is not implemented.");
	}

	public runJs(
		str: string,
		ctx: Context,
		data: ParamsDictionary = {},
		func: FunctionContext = {},
		vars: VarsContext = {},
	): ParamsDictionary {
		return Function("ctx", "data", "func", "vars", `"use strict";return (${str});`)(ctx, data, func, vars);
	}

	public setVar(ctx: Context, vars: VarsContext) {
		if (ctx.vars === undefined) ctx.vars = {};
		ctx.vars = { ...ctx.vars, ...vars };
	}

	public getVar(ctx: Context, name: string) {
		return ctx.vars?.[name];
	}

	public blueprintMapper = (obj: ParamsDictionary, ctx: Context, data?: ParamsDictionary) => {
		let newObj: ParamsDictionary | string = obj;

		try {
			if (typeof obj === "string") newObj = mapper.replaceString(obj, ctx, data as ParamsDictionary);
			else mapper.replaceObjectStrings(newObj, ctx, data as ParamsDictionary);
		} catch (e) {}

		return newObj;
	};

	public setError(config: ErrorContext): GlobalError {
		let errorHandler: GlobalError;

		if (typeof config === "string") {
			errorHandler = new GlobalError(config);
		} else if (config.message && Object.keys(config).length === 1) {
			errorHandler = new GlobalError(config.message as string);
		} else {
			const err = typeof config === "object" ? JSON.stringify(config) : "Unkwon Error";
			errorHandler = new GlobalError(err);
			if (typeof config === "object") {
				errorHandler.setJson(config);
			}
		}

		if (config.json) errorHandler.setJson(config);
		if (config.stack) errorHandler.setStack(config.stack);
		if (config.code) errorHandler.setCode(typeof config.code === "number" ? config.code : 500);

		errorHandler.setName(this.name);

		return errorHandler;
	}

	public getMetrics() {
		return this.metrics.getMetrics();
	}
}
