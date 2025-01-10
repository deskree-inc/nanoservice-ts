type TriggerHttp = {
	method: string;
	path: string;
	jwt_secret?: string;
	accept?: string;
};

export default TriggerHttp;
