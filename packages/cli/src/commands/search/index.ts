import { program } from "../../services/commander.js";

import node from "./nodes.js";
import workflow from "./workflow.js";
// Nodes commands
program.command("search").description("Search commands").addCommand(node).addCommand(workflow);
