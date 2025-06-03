import { type OptionValues, program } from "../../services/commander.js";
import { SearchService } from "./search.js";

program
	.command("search")
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
