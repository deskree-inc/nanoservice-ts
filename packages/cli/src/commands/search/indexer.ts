import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import fg from "fast-glob";
import color from "picocolors";
import pluralize from "pluralize";

type WordMap = Record<string, { path: string; score: number; source: string }[]>;

interface JsonContent {
	name?: string;
	description?: string;
	type?: string;
	[key: string]: unknown;
}

export class Indexer {
	private readonly INDEX_PATH = `${os.homedir()}/.nanoctl/search_indexes.json`;
	private readonly ONE_DAY_MS = 24 * 60 * 60 * 1000;

	private extractKeywords(text: string): string[] {
		// Common English/Spanish stop words and technical terms to ignore
		const stopWords = new Set([
			// English articles and prepositions
			"a",
			"an",
			"the",
			"in",
			"on",
			"at",
			"to",
			"for",
			"of",
			"with",
			"by",
			// Spanish articles and prepositions
			"el",
			"la",
			"los",
			"las",
			"un",
			"una",
			"unos",
			"unas",
			"de",
			"del",
			// Common verbs
			"is",
			"are",
			"was",
			"were",
			"be",
			"been",
			"being",
			"es",
			"son",
			"está",
			"están",
			// Common words
			"this",
			"that",
			"these",
			"those",
			"here",
			"there",
			"este",
			"esta",
			"estos",
			"estas",
			"aquí",
			"allí",
			// Technical terms
			"function",
			"class",
			"const",
			"let",
			"var",
			"return",
			"import",
			"export",
		]);

		// Split into words, remove special characters, and filter
		const words = text
			.toLowerCase()
			// Replace common markdown/code syntax with spaces
			.replace(/```[\s\S]*?```/g, " ") // Remove code blocks
			.replace(/`.*?`/g, " ") // Remove inline code
			.replace(/\[.*?\]/g, " ") // Remove markdown links
			.replace(/\(.*?\)/g, " ") // Remove parentheses
			.replace(/[#*_]/g, " ") // Remove markdown formatting
			// Replace special characters and numbers with spaces
			.replace(/[^a-z\s]/g, " ")
			// Split on whitespace
			.split(/\s+/)
			// Remove stop words and short words
			.filter((word) => word && word.length > 2 && !stopWords.has(word))
			// Convert plurals to singular
			.map((word) => pluralize.singular(word));

		// Return unique words
		return [...new Set(words)];
	}

	private async indexDirectory(dirPath: string, sourceLabel: string): Promise<WordMap> {
		const wordMap: WordMap = {};

		try {
			await fs.access(dirPath);

			const files = await fg(["**/*.md", "**/README.md", "**/readme.md"], {
				cwd: dirPath,
				absolute: true,
				onlyFiles: true,
				followSymbolicLinks: false,
				ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
			});

			for (const file of files) {
				try {
					const raw = await fs.readFile(file, "utf-8");
					const words = this.extractKeywords(raw);

					const fileWordMap: WordMap = {};
					const wordFreq: Record<string, number> = {};

					for (const word of words) {
						wordFreq[word] = (wordFreq[word] || 0) + 1;
					}

					for (const [word, freq] of Object.entries(wordFreq)) {
						const score = freq * Math.sqrt(word.length);
						const entry = { path: file, score, source: sourceLabel };

						if (!fileWordMap[word]) {
							fileWordMap[word] = [];
						} else if (!Array.isArray(fileWordMap[word])) {
							fileWordMap[word] = [];
						}
						fileWordMap[word].push(entry);
					}

					for (const [word, entries] of Object.entries(fileWordMap)) {
						if (!wordMap[word]) {
							wordMap[word] = [];
						} else if (!Array.isArray(wordMap[word])) {
							wordMap[word] = [];
						}
						wordMap[word].push(...entries);
					}
				} catch {
					// Silent fail - file read error
				}
			}
		} catch {
			// Silent fail - directory not found
		}

		return wordMap;
	}

	private async indexJsonDirectory(dirPath: string, sourceLabel: string): Promise<WordMap> {
		const wordMap: WordMap = {};

		try {
			await fs.access(dirPath);

			const files = await fg(["**/*.json"], {
				cwd: dirPath,
				absolute: true,
				onlyFiles: true,
				followSymbolicLinks: false,
				ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
			});

			for (const file of files) {
				try {
					const raw = await fs.readFile(file, "utf-8");
					const jsonContent = JSON.parse(raw) as JsonContent;

					// Dar más peso a palabras en campos importantes
					const importantFields = {
						name: 3, // Triple de peso para palabras en el nombre
						description: 2, // Doble de peso para palabras en la descripción
						type: 1.5, // 1.5x de peso para palabras en el tipo
					};

					const processField = (field: string, content: string, weight: number) => {
						if (typeof content === "string") {
							const words = this.extractKeywords(content);
							for (const word of words) {
								if (!wordMap[word]) wordMap[word] = [];
								wordMap[word].push({
									path: file,
									score: weight * Math.sqrt(word.length),
									source: sourceLabel,
								});
							}
						}
					};

					// Procesar campos importantes primero
					for (const [field, weight] of Object.entries(importantFields)) {
						const content = jsonContent[field];
						if (content && typeof content === "string") {
							processField(field, content, weight);
						}
					}

					// Procesar el resto del contenido con peso normal
					const textContent = JSON.stringify(jsonContent, null, 2);
					const words = this.extractKeywords(textContent);

					const fileWordMap: WordMap = {};
					const wordFreq: Record<string, number> = {};

					for (const word of words) {
						wordFreq[word] = (wordFreq[word] || 0) + 1;
					}

					for (const [word, freq] of Object.entries(wordFreq)) {
						const score = freq * Math.sqrt(word.length);
						const entry = { path: file, score, source: sourceLabel };

						if (!fileWordMap[word]) {
							fileWordMap[word] = [];
						} else if (!Array.isArray(fileWordMap[word])) {
							fileWordMap[word] = [];
						}
						fileWordMap[word].push(entry);
					}

					for (const [word, entries] of Object.entries(fileWordMap)) {
						if (!wordMap[word]) {
							wordMap[word] = [];
						} else if (!Array.isArray(wordMap[word])) {
							wordMap[word] = [];
						}
						wordMap[word].push(...entries);
					}
				} catch {
					// Silent fail - file read/parse error
				}
			}
		} catch {
			// Silent fail - directory not found
		}

		return wordMap;
	}

	private mergeWordMaps(...maps: WordMap[]): WordMap {
		const combined: WordMap = {};
		for (const map of maps) {
			for (const [word, entries] of Object.entries(map)) {
				if (!combined[word]) {
					combined[word] = [];
				} else if (!Array.isArray(combined[word])) {
					combined[word] = [];
				}
				combined[word].push(...entries);
			}
		}
		return combined;
	}

	private async buildIndex() {
		const HOME_DIR = os.homedir();
		const NANOCTL_DIR = path.join(HOME_DIR, ".nanoctl");
		const GITHUB_REPO_LOCAL = path.join(NANOCTL_DIR, "nanoservice-ts");
		const homeDocsPath = path.join(GITHUB_REPO_LOCAL, "docs");
		const userNodesPath = path.resolve(process.cwd(), "src/nodes");
		const notesPath = path.resolve(process.cwd(), "notes");
		const jsonPath = path.resolve(process.cwd(), "workflows/json");

		await fs.mkdir(NANOCTL_DIR, { recursive: true });

		const docsMap = await this.indexDirectory(homeDocsPath, "docs");
		const userMap = await this.indexDirectory(userNodesPath, "user-nodes");
		const notesMap = await this.indexDirectory(notesPath, "notes");
		const jsonMap = await this.indexJsonDirectory(jsonPath, "json-examples");

		const combinedMap = this.mergeWordMaps(docsMap, userMap, notesMap, jsonMap);

		const sortedWords = Object.entries(combinedMap)
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([value, files]) => ({
				value,
				files,
			}));

		const index = {
			words: sortedWords,
			lastIndexDateTime: new Date().toISOString(),
		};

		await fs.writeFile(this.INDEX_PATH, JSON.stringify(index, null, 2));
		return index;
	}

	public async getIndex(forceRebuild = false): Promise<ReturnType<typeof this.buildIndex>> {
		try {
			if (!forceRebuild) {
				const stat = await fs.stat(this.INDEX_PATH);
				const age = Date.now() - new Date(stat.mtime).getTime();
				if (age <= this.ONE_DAY_MS) {
					const raw = await fs.readFile(this.INDEX_PATH, "utf-8");
					return JSON.parse(raw);
				}
				console.log(color.yellow("Index outdated. Rebuilding..."));
			} else {
				console.log(color.yellow("Force rebuilding index..."));
			}
		} catch {
			console.log(color.yellow("No index found. Creating new one..."));
		}

		return await this.buildIndex();
	}
}
