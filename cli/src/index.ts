import { Command } from "commander";
import { createProject } from "./commands/create/project.js";
import { getPackageVersion } from "./services/utils.js";

const program = new Command();
const version = await getPackageVersion();
program
	.name("nanoctl")
	.version(`${version}`, "-v, --version")
	.description(`Nanoservice CLI ${version}`)
	.action(() => {
		console.log(`Nanoservice CLI: ${version}`);
	});

program
	.command("create")
	.description("Create a new nanoservice component")
	.command("project")
	.description("Create a new Nano Service Project")
	.action(() => {
		createProject();
	});

program.parse(process.argv);
