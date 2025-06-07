import type { JsonLikeObject } from "@blok-ts/runner";

export default class InMemory {
	protected static _instance: InMemory;
	protected data: Record<string, string | JsonLikeObject> = {};

	public static getInstance(): InMemory {
		if (!InMemory._instance) {
			InMemory._instance = new InMemory();
		}
		return InMemory._instance;
	}

	get(key: string): string | JsonLikeObject | null {
		return this.data[key] ?? null;
	}
	getAll(): Record<string, string | JsonLikeObject> {
		return this.data;
	}
	set(key: string, value: string | JsonLikeObject): void {
		this.data[key] = value;
	}
	delete(key: string): void {
		delete this.data[key];
	}
	clear(): void {
		this.data = {};
	}
}
