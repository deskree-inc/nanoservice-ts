export default async function importEsModule(name: string) {
	const mastra = await import(name);
	return mastra;
}
