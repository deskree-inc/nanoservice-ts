import type { JsonLikeObject } from "@nanoservice-ts/runner";
import type { Context } from "@nanoservice-ts/shared";
import { MessageEncoding, MessageType, type WorkflowRequest, type WorkflowResponse } from "./gen/workflow_pb";
const { XMLParser, XMLBuilder } = require("fast-xml-parser");

export default class MessageDecode {
	requestDecode(request: WorkflowRequest): Context {
		let message: Context = <Context>{};
		switch (request.Encoding) {
			case MessageEncoding.BASE64: {
				const messageStr = Buffer.from(request.Message, "base64").toString("utf-8");
				message = this.decodeType(messageStr, request.Type);
				break;
			}
			case MessageEncoding.STRING: {
				message = this.decodeType(request.Message, request.Type);
				break;
			}
			default:
				throw new Error(`Unsupported encoding: ${request.Encoding}`);
		}

		return message;
	}

	decodeType(message: string, type: MessageType): Context {
		switch (type) {
			case MessageType.JSON: {
				return JSON.parse(message);
			}
			case MessageType.XML: {
				return new XMLParser().parse(message);
			}
			default:
				throw new Error(`Unsupported type: ${type}`);
		}
	}

	responseEncode(ctx: Context, encoding: MessageEncoding, type: MessageType): WorkflowResponse {
		let message: string | object | Buffer<ArrayBuffer>;
		const responseType = this.mapContentType(ctx.response.contentType as string);
		switch (encoding) {
			case MessageEncoding.BASE64: {
				if (responseType === MessageType.JSON) {
					message = this.encodeType(ctx.response.data as JsonLikeObject, type);
					message = Buffer.from(message).toString("base64");
				}
				if (responseType === MessageType.XML) {
					message = this.encodeType(ctx.response.data as object, type);
					message = Buffer.from(message).toString("base64");
				} else {
					message = this.encodeType(ctx.response.data as string, type);
					message = Buffer.from(message).toString("base64");
				}
				break;
			}
			case MessageEncoding.STRING: {
				if (responseType === MessageType.JSON) {
					message = this.encodeType(ctx.response.data as JsonLikeObject, type);
				}
				if (responseType === MessageType.XML) {
					message = this.encodeType(ctx.response.data as object, type);
				} else {
					message = this.encodeType(ctx.response.data as string, type);
				}
				break;
			}
			default:
				throw new Error(`Unsupported encoding: ${encoding}`);
		}

		return {
			Message: message,
			Encoding: MessageEncoding[encoding],
			Type: MessageType[responseType],
		} as WorkflowResponse;
	}

	responseErrorEncode(e: string | JsonLikeObject, encoding: MessageEncoding, type: MessageType): string {
		let message: string | object | Buffer<ArrayBuffer>;
		switch (encoding) {
			case MessageEncoding.BASE64:
				message = Buffer.from(this.encodeType(e, type)).toString("base64");
				break;
			case MessageEncoding.STRING:
				message = this.encodeType(e, type);
				break;
			default:
				throw new Error(`Unsupported encoding: ${encoding}`);
		}

		return message as string;
	}

	encodeType(message: string | object | Buffer<ArrayBuffer>, type: MessageType): string {
		switch (type) {
			case MessageType.JSON:
				return JSON.stringify(message);
			case MessageType.TEXT:
			case MessageType.HTML:
				return message.toString();
			case MessageType.XML:
				return new XMLBuilder().build(message);
			default:
				throw new Error(`Unsupported type: ${type}`);
		}
	}

	mapContentType(contentType: string): MessageType {
		switch (contentType) {
			case "application/json":
				return MessageType.JSON;
			case "text/html":
				return MessageType.HTML;
			case "text/xml":
				return MessageType.XML;
			default:
				return MessageType.TEXT;
		}
	}
}
