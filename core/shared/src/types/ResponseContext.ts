import type BlueprintError from "../GlobalError";

type ResponseContext = {
	data: unknown;
	error: BlueprintError | null;
	success?: boolean;
	contentType?: string;
};

export default ResponseContext;
