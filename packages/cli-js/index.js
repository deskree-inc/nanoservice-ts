#! /usr/bin/env node
import { Command } from "commander";
import { createNode } from "./commands/create/node.js";
import { createProject } from "./commands/create/project.js";
import { getPackageVersion } from "./services/utils.js";

async function main() {
	try {
		const program = new Command();
		const version = await getPackageVersion();
		program
			.name("nanoctl")
			.version(`${version}`, "-v, --version")
			.description(`Nanoservice CLI ${version}`)
			.action(() => {
				console.log(`Nanoservice CLI: ${version}`);
			});

		const create = program.command("create").description("Create a new nanoservice component");

		const project = program
			.command("project")
			.description("Create a new Project")
			.option("-n, --name <value>", "Create a default Project")
			.action((options) => {
				createProject(options);
			});

		const node = program
			.command("node")
			.description("Create a new Node")
			.option("-n, --name <value>", "Create a default Node")
			.action((options) => {
				createNode(options);
			});

		create.addCommand(project);
		create.addCommand(node);

		program.parse(process.argv);
	} catch (err) {
		console.log(err.message);
	}
}

main();
