# Multi-Agent AI CLI Architecture

## Overview

This architecture defines a scalable CLI-based multi-agent system built on top of LangChain.js, designed to support AI-driven generation of nanoservice nodes, workflows, and configurations. It includes support for:

* Terminal-based chat interface
* LangChain.js
* Multi-agent logic
* MCP client integrations (Model Context Protocol)
* Tooling for file management and local validation
* Shared sessions (Milvus + Redis)
* Intent classification and routing
* Parallelization and separation of concerns

---

### Folder structure

```txt
├── agents
│   ├── IntentRouterAgent.ts
│   ├── NodeWriterAgent.ts
│   ├── WorkflowWriterAgent.ts
│   └── ...
├── core
│   ├── MultiAgentExecutor.ts
│   ├── MCPClient.ts
│   ├── MemoryManager.ts
│   ├── ToolExecutor.ts
│   ├── SessionManager.ts
│   └── PromptValidator.ts
├── tools
│   ├── FileWriterTool.ts
│   ├── FileReaderTool.ts
│   └── ...
├── prompts
│   ├── system-intent-router.txt
│   ├── system-node-writer.txt
│   └── ...
├── chat
│   └── ChatLoop.ts
├── config
│   └── mcp.config.ts
└── index.ts
```

---

## System Components

### 1. Terminal Chat Entry Point

Command:

```bash
npx nanoctl@latest chat
```

Opens a REPL chat where the user can ask for:

* Node generation
* Workflow creation
* Validation help
* Metrics inspection
* and more...

### 2. LangChain.js Core

LangChain.js orchestrates:

* Prompt management
* Tool usage (custom and built-in)
* Agent execution
* Memory (long and short term)

### 3. Multi-Agent Architecture

Each agent has a single responsibility. Example agents:

* **NodeAgent**: Generates new nanoservice node code.
* **WorkflowAgent**: Creates JSON workflows.
* **ValidatorAgent**: Validates user-generated content.
* **FileAgent**: Writes or reads files.
* **MCPDispatcherAgent**: Sends requests to an MCP server.

Agents can delegate tasks to each other.

### 4. MCP Client Support

The CLI does **not act as an MCP server**. Instead, it connects to existing remote MCP servers. MCP configuration is customizable per session or per prompt.

Features:

* Dynamic selection of MCP providers
* Authentication token injection
* Fallback and retry mechanisms

### 5. Tools Layer

Custom LangChain tools include:

* `WriteFileTool`
* `ReadFileTool`
* `ValidateCodeTool`
* `RegisterNodeTool`
* `PromptSelectorTool`

These tools wrap local logic needed by agents.

### 6. Intent Classification

A lightweight intent classifier (via embedding or few-shot classification) analyzes user input to:

* Route the task to the right agent
* Select system prompt or MCP client

Example intents:

* `generate_node`
* `create_workflow`
* `update_registry`
* `run_validator`

### 7. Session Management

* **Milvus**: Vector store for long-term context
* **Redis**: Caching + short-term chat memory
* Each session tagged with user/task ID

### 8. Parallelization & Observability

* Use `Promise.all` for concurrent agent execution
* Tool outputs and LLM calls are tracked for debugging
* Agents log step-by-step reasoning

---

## CLI Flow Example

User runs:

```bash
npx nanoctl@latest chat
```

User types:

> Create a node to fetch countries from a public API

Flow:

1. Intent classifier: `generate_node`
2. PromptSelectorTool picks the system prompt
3. NodeAgent is called with:

   * System prompt
   * User request
4. NodeAgent may call:

   * MCPDispatcherAgent to use OpenAI or other LLM
   * WriteFileTool to save node
   * RegisterNodeTool to update registry
5. CLI outputs: success + file path + metrics

---

## Example Commands for Developers

```bash
npx nanoctl chat                           # Start terminal chat
```

> Note: These commands route to agents, not directly to prompts. The system decides which system prompt/tool to apply.

---

## Summary

This architecture is designed to support powerful AI workflows from the terminal using a clean, multi-agent approach. The separation of concerns, session storage, and MCP client modularity allow for robust long-term evolution.
