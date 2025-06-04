import { Command, type OptionValues } from "../../services/commander.js";

import fs from "node:fs/promises";
import path from "node:path";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import color from "picocolors";
import pluralize from "pluralize";
import { Indexer } from "./indexer.js";

interface SearchOptions {
	noCache?: boolean;
	useAI?: boolean;
}

interface IndexWord {
	value: string;
	files: Array<{ path: string; score: number }>;
}

interface SearchIndex {
	words: IndexWord[];
	lastIndexDateTime: string;
}

export class SearchService {
	private readonly MAX_TOKENS = 3000;
	private readonly indexer = new Indexer();

	private extractKeywords(text: string): string[] {
		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, "")
			.split(/\s+/)
			.map((w) => pluralize.singular(w))
			.filter(Boolean);
	}

	private estimateTokens(text: string): number {
		return Math.ceil(text.length / 4);
	}

	private async getRankedFilesFromIndex(
		index: SearchIndex,
		question: string,
	): Promise<{ path: string; score: number }[]> {
		const keywords = this.extractKeywords(question);

		const fileScores: Record<string, number> = {};

		for (const word of keywords) {
			let matches = index.words.filter((w: IndexWord) => w.value === word);

			if (matches.length === 0 && word.length > 3) {
				matches = index.words.filter((w: IndexWord) => w.value.includes(word) || word.includes(w.value));
			}

			if (matches.length === 0) continue;

			for (const match of matches) {
				for (const fileEntry of match.files) {
					const matchScore = match.value === word ? fileEntry.score : fileEntry.score * 0.5;
					fileScores[fileEntry.path] = (fileScores[fileEntry.path] || 0) + matchScore;
				}
			}
		}

		return Object.entries(fileScores)
			.map(([path, score]) => ({ path, score }))
			.sort((a, b) => b.score - a.score);
	}

	private async getLimitedContext(files: { path: string }[]): Promise<string> {
		let total = 0;
		const chunks: string[] = [];

		for (const { path: file } of files) {
			try {
				const content = await fs.readFile(file, "utf-8");

				// Formatear el contenido según el tipo de archivo
				let formattedContent: string;
				if (file.endsWith(".json")) {
					const jsonContent = JSON.parse(content);
					formattedContent = [
						`# ${jsonContent.name || path.basename(file)}`,
						`Description: ${jsonContent.description || "No description"}`,
						jsonContent.type ? `Type: ${jsonContent.type}` : "",
						"",
						"Configuration:",
						"```json",
						JSON.stringify(jsonContent, null, 2),
						"```",
					]
						.filter(Boolean)
						.join("\n");
				} else {
					formattedContent = content;
				}

				const tokens = this.estimateTokens(formattedContent);
				if (total + tokens > this.MAX_TOKENS) break;
				total += tokens;
				chunks.push(`---\n# File: ${path.basename(file)}\n${formattedContent}`);
			} catch (error) {
				console.log(color.red(`Error reading file: ${file}`));
			}
		}

		return chunks.join("\n\n");
	}

	public async ask(question: string, options: SearchOptions = {}): Promise<void> {
		const index = await this.indexer.getIndex(options.noCache);

		const ranked = await this.getRankedFilesFromIndex(index, question);
		if (ranked.length === 0) {
			console.log(color.yellow("No relevant files found for the search terms"));
			return;
		}

		const context = await this.getLimitedContext(ranked);
		if (!context) {
			console.log(color.yellow("No content could be read from the files"));
			return;
		}

		try {
			const openai = createOpenAI({
				compatibility: "strict",
				apiKey: process.env.OPENAI_API_KEY,
			});

			console.log(color.cyan("\nAnalyzing documentation..."));

			const response = await generateText({
				model: openai("gpt-4"),
				system: `You are a helpful assistant that answers questions based on the documentation provided.
Your responses should be clear, concise, and directly based on the content in the documentation.
If the documentation includes code examples or configuration, include relevant parts in your response.
Format your response using markdown for better readability.`,
				prompt: `Context:\n${context}\n\nQuestion: ${question}`,
				temperature: 0.2,
			});

			// Mostrar las fuentes usadas primero
			console.log(`\n${color.dim("Sources used:")}`);
			for (const { path: file, score } of ranked) {
				console.log(color.dim(`- ${path.basename(file)} (relevance: ${score.toFixed(2)})`));
			}
			console.log();

			// Mostrar la respuesta al final
			console.log(color.green("Answer:"));
			console.log("─".repeat(process.stdout.columns || 80));
			console.log(this.formatResponseText(response.text));
			console.log("─".repeat(process.stdout.columns || 80));
			console.log(); // Add final empty line for better readability
		} catch (error) {
			console.log(color.red("\nError generating response:"));
			console.log(color.red(error instanceof Error ? error.message : "Unknown error"));
		}
	}

	private formatResponseText(text: string): string {
		// Split the text into lines
		return text
			.split("\n")
			.map((line) => {
				// Format code blocks
				if (line.startsWith("```")) {
					return color.dim("─".repeat(process.stdout.columns || 80));
				}

				// Format inline code
				if (line.includes("`")) {
					return line.replace(/`([^`]+)`/g, (_, code) => color.cyan(code));
				}

				// Format bold text
				if (line.includes("**")) {
					return line.replace(/\*\*([^*]+)\*\*/g, (_, text) => color.bold(text));
				}

				// Format headers
				if (line.startsWith("#")) {
					const headerMatch = line.match(/^#+/);
					if (headerMatch) {
						const title = line.replace(/^#+\s*/, "");
						return color.bold(color.blue(title));
					}
				}

				// Format lists
				if (line.match(/^[-*]\s/)) {
					return `${color.dim("•")} ${line.replace(/^[-*]\s/, "")}`;
				}

				// Format numbered lists
				if (line.match(/^\d+\.\s/)) {
					const numMatch = line.match(/^\d+/);
					if (numMatch) {
						return `${color.dim(`${numMatch[0]}.`)}${line.replace(/^\d+\.\s/, " ")}`;
					}
				}

				// Format JSON content inside code blocks
				if (line.match(/^\s*["{[]/) && line.match(/[}"\]]$/)) {
					try {
						return color.gray(line);
					} catch {
						return line;
					}
				}

				// Regular text
				return line;
			})
			.join("\n");
	}
}

export default new Command()
	.command("docs")
	.description("This command allows you to search for information in the documentation.")
	.option("-q, --question <value>", "Question to search for")
	.option("--no-cache", "Force rebuild of search index")
	.action(async (options: OptionValues) => {
		const question = options.question;
		if (!question) {
			console.error("Question is required");
			process.exit(1);
		}
		const searchService = new SearchService();
		await searchService.ask(question, { noCache: !options.cache });
	});
