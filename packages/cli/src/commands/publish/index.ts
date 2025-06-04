import { program } from "../../services/commander.js";

import node from "./node.js";
import workflow from "./workflow.js";
// Nodes commands
program.command("publish").description("Publish commands").addCommand(node).addCommand(workflow);
