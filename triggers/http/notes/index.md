# Quick Start Guide

## 1. Setting Up Your Environment

Get started with `nanoservice-ts` by following these steps:

### Prerequisites
Ensure the following are installed:
- **Node.js** (v22.14.0 LTS recommended)

### Step 1: Create a New Project
Run the command below to create a project:
```sh
npx nanoctl@latest create project
```
Follow the prompts:
1. Assign a project name.
2. Select **HTTP trigger** (default).
3. Choose **NodeJS** as the runtime (Python3 is in alpha).
4. **Select Example Installation: YES** (recommended for discovery and learning).

### Step 2: Navigate to Your Project and Start the Server
```sh
cd your-project-name
pnpm run dev
```
Your server will be running at:  
`http://localhost:4000`

---

## 2. Running the Example Workflows

Explore the provided example workflows to get started. Access them via:

- **Countries API**:  
    `http://localhost:4000/countries`

---

## 🔍 Next Steps

Now that you understand the basics, dive deeper into `nanoservice-ts` with the following resources:

- [Context](./Core_Concepts/Context.md)
- [Creating Workflows](./CLI_Commands/Create_Workflow.md)  
- [Creating Custom Nodes](./CLI_Commands/Create_Node.md)
- [Examples](./examples.md)