# Multi-Agent AI CLI Architecture (Updated with MCP Client Integration)

## Overview

This architecture defines the design of a multi-agent system to generate and manage nanoservice Nodes and Workflows through a terminal-based chat interface using LangChain.js. It supports multiple LLMs via **MCP Clients** (Model Context Protocol) and is designed for scalability, separation of concerns, and developer extensibility.

---

## 🎯 Objective

To build an intelligent CLI assistant with:

* Terminal chat experience
* LangChain.js orchestration
* Multi-agent support (Node agent, Workflow agent, etc.)
* Integration with external **MCP Servers** via **MCP Client** logic
* Tool-based local executions (e.g., file system, registry updates)
* Shared memory via Redis and Milvus

---

## 🧠 System Components

### 1. CLI Entry Point

```bash
npx nanoctl@latest chat
```

* Launches the terminal chat experience.
* Accepts natural language instructions.

### 2. Intent Mapper

* Maps user intent to agent route:

  * "create a workflow" → `WorkflowAgent`
  * "build a node that fetches countries" → `NodeAgent`

### 3. Agent Router

* Chooses correct agent and orchestrates tool execution and MCP LLM interaction.

### 4. MCP Client Layer

* Loads multiple MCP Client configurations from `.mcp-config.json`, e.g.:

```json
{
  "clients": [
    { "id": "openai", "provider": "OpenAI", "apiKey": "..." },
    { "id": "anthropic", "provider": "Anthropic", "apiKey": "..." }
  ]
}
```

* Chooses provider dynamically based on agent config, prompt type, or intent.
* Does **not** expose this config to user during chat. It’s handled internally.

### 5. LangChain.js Orchestration

* Supports:

  * Tools: file writer, file reader, metrics parser
  * Memory: Redis for short-term, Milvus for vector long-term
  * Retry logic, validation, and tool chaining

### 6. Tools

Reusable tools that agents use:

* `CodeWriterTool`
* `NodeRegistrarTool`
* `WorkflowComposerTool`
* `PromptValidatorTool`

### 7. Multi-Agent Support

Each agent has:

* A system prompt
* Tool set
* Supported intents
* MCP Client config or defaults

Agents:

* `NodeAgent`
* `WorkflowAgent`
* `ProjectAgent`
* Future: `DebugAgent`, `AnalyticsAgent`, `ChatDocAgent`

---

## 🗃️ Example Workflow

1. User runs:

   ```bash
   npx nanoctl@latest chat
   ```
2. Types:

   ```
   Create a node that gets all country capitals
   ```
3. IntentMapper → `NodeAgent`
4. NodeAgent uses system prompt and chooses OpenAI from MCP Client config
5. Calls LangChain agent executor with:

   * Tools: `CodeWriter`, `NodeRegistrar`
   * Memory session
   * Prompt to OpenAI
6. Receives valid TS code → writes file → updates registry → confirms to user

---

## ✅ Key Features

* Configurable and extensible agent structure
* Seamless MCP Client support without user interaction
* Local and AI-assisted tooling
* Real-time terminal interaction
* Designed for scalability and collaborative workflows

---

## 🧩 Future Improvements

* GUI alternative
* Plugin registration system
* AI QA validator for outputs
* Fine-tuned reward model loop for feedback and reinforcement

---

## 📝 Summary

This architecture provides the foundation for an extensible, intelligent CLI that leverages LangChain.js and MCP Client integration to support multi-agent AI development for nanoservice applications.

You launch once with:

```bash
npx nanoctl@latest chat
```

And let the agents do the rest.
