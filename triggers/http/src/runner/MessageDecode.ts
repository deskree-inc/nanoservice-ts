import type { JsonLikeObject } from "@blok-ts/runner";
import type { Context } from "@blok-ts/runner";
import type WorkflowRequest from "./types/WorkflowRequest";
import type WorkflowResponse from "./types/WorkflowResponse";

export default class MessageDecode {
	requestDecode(request: WorkflowRequest): Context {
		let message: Context = <Context>{};

		switch (request.Encoding) {
			case "BASE64": {
				const messageStr = Buffer.from(request.Message, "base64").toString("utf-8");
				message = this.decodeType(messageStr, request.Type);
				break;
			}
			case "STRING": {
				message = this.decodeType(request.Message, request.Type);
				break;
			}
			default:
				throw new Error(`Unsupported encoding: ${request.Encoding}`);
		}

		return message;
	}

	responseDecode(response: WorkflowResponse): JsonLikeObject {
		let message: JsonLikeObject = {};
		console.log("response", response);

		switch (response.Encoding) {
			case "BASE64": {
				const messageStr = Buffer.from(response.Message, "base64").toString("utf-8");
				message = this.decodeType(messageStr, response.Type) as unknown as JsonLikeObject;
				break;
			}
			case "STRING": {
				message = this.decodeType(response.Message, response.Type) as unknown as JsonLikeObject;
				break;
			}
			default:
				throw new Error(`Unsupported encoding: ${response.Encoding}`);
		}

		return message;
	}

	decodeType(message: string, type: string): Context {
		switch (type) {
			case "JSON": {
				return JSON.parse(message);
			}
			default:
				throw new Error(`Unsupported type: ${type}`);
		}
	}
}
