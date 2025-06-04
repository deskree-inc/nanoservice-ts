import fs from "node:fs";
import os from "node:os";
import { Command } from "commander";
import { type OptionValues, program } from "../../services/commander.js";

interface CliConfig {
	defaultEditor?: string;
}

const create = new Command("config").description("Configure CLI settings");

create
	.command("set")
	.description("Configure CLI settings")
	.option(
		"--editor <editor>",
		"Set default editor 'Visual Studio Code', 'Cursor', 'Sublime Text', 'Atom', 'WebStorm'",
		(value) => {
			const validEditors = ["Visual Studio Code", "Cursor", "Sublime Text", "Atom", "WebStorm"];
			if (!validEditors.includes(value)) {
				throw new Error(`Editor must be one of: ${validEditors.join(", ")}`);
			}
			return value;
		},
	)
	.action(async (options: OptionValues) => {
		const configDir = `${os.homedir()}/.nanoctl`;
		const configPath = `${configDir}/config.json`;

		// Ensure config directory exists
		if (!fs.existsSync(configDir)) {
			fs.mkdirSync(configDir, { recursive: true });
		}

		// Load existing config or create new one
		let config: CliConfig = {};
		if (fs.existsSync(configPath)) {
			config = JSON.parse(fs.readFileSync(configPath, "utf8"));
		}

		if (options.editor) {
			config.defaultEditor = options.editor;
			fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
			console.log(`Default editor set to: ${options.editor}`);
		}
	});

create
	.command("list")
	.description("Show current CLI configuration")
	.action(() => {
		const configPath = `${os.homedir()}/.nanoctl/config.json`;
		if (fs.existsSync(configPath)) {
			const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
			console.log("Current configuration:");
			console.log(JSON.stringify(config, null, 2));
		} else {
			console.log("No configuration file found. Using defaults.");
		}
	});

program.addCommand(create);
