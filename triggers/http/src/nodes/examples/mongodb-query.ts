import {
	type INanoServiceResponse,
	type JsonLikeObject,
	NanoService,
	NanoServiceResponse,
} from "@nanoservice-ts/runner";
import { type Context, GlobalError } from "@nanoservice-ts/shared";
import { MongoClient, ObjectId, type OptionalId, type Sort } from "mongodb";

type InputType = {
	collection: string;
	data?: OptionalId<JsonLikeObject>;
	id?: string;
	limit?: number;
	skip?: number;
	sort?: Sort;
	filter?: JsonLikeObject;
};

export default class MongoQuery extends NanoService<InputType> {
	constructor() {
		super();
		this.inputSchema = {
			$schema: "http://json-schema.org/draft-04/schema#",
			type: "object",
			properties: {
				collection: { type: "string" },
				data: { type: "object" },
				id: { type: "string" },
				limit: { type: "number" },
				skip: { type: "number" },
				sort: { type: "object" },
				filter: { type: "object" },
			},
			required: ["collection"],
		};
	}

	async handle(ctx: Context, inputs: InputType): Promise<INanoServiceResponse> {
		const response: NanoServiceResponse = new NanoServiceResponse();
		const client = new MongoClient(process.env.MONGODB_URI as string);

		try {
			await client.connect();
			const db = client.db(process.env.MONGODB_DATABASE);
			const collection = db.collection(inputs.collection as string);

			// Determine action based on HTTP method
			const method = ctx.request.method as unknown as string;

			switch (method) {
				case "POST": {
					if (inputs.data === undefined) {
						throw new Error("Data is required for POST method");
					}
					const result_post = await collection.insertOne(inputs.data);
					response.setSuccess({ insertedId: result_post.insertedId.toString() });
					break;
				}
				case "GET": {
					if (inputs.id !== "undefined") {
						// Fetch a single document by ID
						const result = await collection.findOne({ _id: new ObjectId(inputs.id) });
						response.setSuccess(result as unknown as JsonLikeObject);
					} else {
						// Fetch all with a limit (default: 10)
						const result = await collection
							.find(inputs.filter || {})
							.sort(inputs.sort || {})
							.skip(inputs.skip || 0)
							.limit(inputs.limit || 10)
							.toArray();
						response.setSuccess(result as unknown as JsonLikeObject);
					}
					break;
				}
				case "PUT": {
					const result_put = await collection.updateOne(
						{ _id: new ObjectId(inputs.id as string) },
						{ $set: inputs.data },
					);
					response.setSuccess({ modifiedCount: result_put.modifiedCount });
					break;
				}
				case "DELETE": {
					const result = await collection.deleteOne({ _id: new ObjectId(inputs.id as string) });
					response.setSuccess({ deletedCount: result.deletedCount });
					break;
				}
				default:
					throw new Error("Invalid HTTP method");
			}
		} catch (error: unknown) {
			const nodeError = new GlobalError((error as Error).message);
			nodeError.setCode(500);
			response.setError(nodeError);
		} finally {
			await client.close();
		}

		return response;
	}
}
