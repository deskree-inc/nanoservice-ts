import { program } from "../../services/commander.js";

import docs from "./docs.js";
import node from "./nodes.js";
import workflow from "./workflow.js";
// Nodes commands
program.command("search").description("Search commands").addCommand(node).addCommand(workflow).addCommand(docs);
