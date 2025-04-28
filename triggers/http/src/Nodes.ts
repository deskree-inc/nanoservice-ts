import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import type { NodeBase } from "@nanoservice-ts/shared";
import ImageCaptureUI from "./nodes/examples/image-capture";
import SaveImageBase64 from "./nodes/examples/save-base64-image";
import ErrorNode from "./nodes/examples/workflow-docs/ErrorNode";

const nodes: {
	[key: string]: NodeBase;
} = {
	"@nanoservice-ts/api-call": new ApiCall(),
	"@nanoservice-ts/if-else": new IfElse(),
	"save-image": new SaveImageBase64(),
	"image-capture-ui": new ImageCaptureUI(),
	error: new ErrorNode(),
};

export default nodes;
