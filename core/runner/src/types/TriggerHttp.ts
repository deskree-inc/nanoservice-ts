interface TriggerHttp {
	method: string;
	path: string;
	jwt_secret?: string;
	accept?: string;
	inputs?: TriggerInputSchema;
	output?: Record<string, unknown>;
}

interface TriggerInputSchema {
	params?: Record<string, unknown>;
	query?: Record<string, unknown>;
	body?: {
		type: string;
		properties: Record<string, unknown>;
		required?: string[];
	};
}

export default TriggerHttp;
