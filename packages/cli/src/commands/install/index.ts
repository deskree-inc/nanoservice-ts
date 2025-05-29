import { program } from "../../services/commander.js";

import node from "./node.js";
// Nodes commands
program.command("install").description("Install commands").addCommand(node);
