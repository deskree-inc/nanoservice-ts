export default class InMemory {
	protected static _instance: InMemory;
	protected data: Record<string, string> = {};

	public static getInstance(): InMemory {
		if (!InMemory._instance) {
			InMemory._instance = new InMemory();
		}
		return InMemory._instance;
	}

	get(key: string): string | null {
		return this.data[key] ?? null;
	}
	set(key: string, value: string): void {
		this.data[key] = value;
	}
	delete(key: string): void {
		delete this.data[key];
	}
	clear(): void {
		this.data = {};
	}
}
