# 🛠 Creating a Node in `nanoservice-ts`

A **node** is the core component of a workflow in `nanoservice-ts`. It represents a reusable function that can be executed as part of a workflow.

This guide walks you through creating a **custom node** using **TypeScript**.

---

## 📌 Step 1: Create a Node Using the CLI

To create a new node, run the following command from the **root directory** of your nanoservice project:

```bash
npx nanoctl@latest create node
```

### 📥 CLI Inputs

You will be prompted to provide the following information:

1. **Node Name**  
    Enter a unique name for the node (e.g., `fetch`).

2. **Select Runtime**  
    Choose between:
    - **TypeScript (recommended)** ✅ *(Default)*
    - **Python3** *(Alpha version, MacOS & Linux only)*  
    *(For this guide, select **TypeScript**.)*

3. **Select Nanoservice Type**  
    Choose between:
    - **Module** *(For npm-published nodes – ❌ not needed for this guide)*
    - **Class** ✅ *(Default, for local nodes)*

4. **Select Template**  
    Choose between:
    - **Class (recommended)** ✅ *(Default)*
    - UI - EJS - REACTJS - TailwindCSS *(not required for this guide)*

---

## 📌 Step 2: Navigate to the New Node Directory

Once the node is created, navigate to its directory:

```bash
cd src/nodes/fetch
```

---

## 📌 Step 3: Update the Node Class Name

Open the `index.ts` file inside the node directory and **update the class name** to match your node name (`Fetch` in this example):

```typescript
// Original class name
export default class Node extends NanoService {
     ...
}

// Updated class name
export default class Fetch extends NanoService {
     ...
}
```

---

## 📌 Step 4: Register the Node in the `Nodes.ts` File

To make your node available in workflows, **register it inside `src/Nodes.ts`**:

```typescript
import ApiCall from "@nanoservice-ts/api-call";
import IfElse from "@nanoservice-ts/if-else";
import type { NodeBase } from "@nanoservice-ts/shared";
import Fetch from "./nodes/fetch";

const nodes: {
     [key: string]: NodeBase;
} = {
     "@nanoservice-ts/api-call": new ApiCall(),
     "@nanoservice-ts/if-else": new IfElse(),
     "fetch": new Fetch()
};

export default nodes;
```

---

## 📌 Step 5: Validate the Node

To confirm that the new node is registered correctly:

1. **Start the project**  
    Run the following command in the project root directory:

    ```bash
    npm run dev
    ```

---

## 🎯 Summary

- ✅ **Created a custom node** using the CLI.  
- ✅ **Configured the node class name** correctly.  
- ✅ **Registered the node** inside `Nodes.ts`.  
- ✅ **Validated the project setup**.

Your node is now ready to be used in workflows! 🎉

---

## 🔍 Next Steps

- [Context](../Core_Concepts/Context.md)
- [Creating Workflows](../CLI_Commands/Create_Workflow.md)  
- [Creating Custom Nodes](../CLI_Commands/Create_Node.md)  
- [Examples](../examples.md)
- [Index](../index.md)