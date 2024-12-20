export default interface JsonLikeObject {
	[key: string]: string | number | boolean | JsonLikeObject | JsonLikeObject[];
}
