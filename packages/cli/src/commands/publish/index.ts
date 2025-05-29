import { program } from "../../services/commander.js";

import node from "./node.js";
// Nodes commands
program.command("publish").description("Publish commands").addCommand(node);
