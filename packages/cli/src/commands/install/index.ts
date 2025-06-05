import { program } from "../../services/commander.js";

import node from "./node.js";
import workflow from "./workflow.js";
// Nodes commands
program.command("install").description("Install commands").addCommand(node).addCommand(workflow);
