import { program } from "../../services/commander.js";

import install from "./install.js";
import publish from "./publish.js";
import search from "./search.js";

// Nodes commands
program.command("nodes").description("Node commands").addCommand(publish).addCommand(install).addCommand(search);
