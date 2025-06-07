# 🚀 Creating a Workflow in nanoservice-ts

A **workflow** in `nanoservice-ts` is a structured JSON file that defines:

- **A trigger** that starts the workflow execution.
- **A sequence of steps** that execute bloks (nodes).
- **Node configurations** that define how each step operates.

---

## 📌 Step 1: Create a Workflow Using the CLI

To create a new workflow, run the following command:

```sh
npx blokctl@latest create workflow
```

### 🛠 CLI Inputs

- **Workflow Name**: Provide a unique name for your workflow.
- The workflow JSON file will be created inside the `workflows/json/` directory.

---

## 📌 Step 2: Understand the Workflow Structure

A workflow consists of **three** main sections:

1. **Trigger**: Defines how the workflow is executed.  
2. **Steps**: Specifies the sequence of nodes executed in order.  
3. **Nodes**: Configures each node used in the steps.  

---

## 📌 Step 3: Example Workflow (Fetching Data)

Below is an example of a workflow named **"fetch-cat-facts"** that makes an HTTP request to fetch cat facts. Save this file as `workflows/json/cats.json`:

```json
{
    "name": "fetch-cat-facts",
    "description": "This workflow fetches random cat facts from a public API.",
    "version": "1.0.0",
    "trigger": {
        "http": {
            "method": "GET",
            "path": "/",
            "accept": "application/json"
        }
    },
    "steps": [
        {
            "name": "fetch_api_data",
            "node": "@blok-ts/api-call",
            "type": "module"
        }
    ],
    "nodes": {
        "fetch_api_data": {
            "inputs": {
                "url": "https://catfact.ninja/fact",
                "method": "GET",
                "headers": {}
            }
        }
    }
}
```

---

## 📌 Step 4: Workflow Structure Breakdown

### 🔹 1. **Trigger Section**

The `trigger` defines how the workflow is executed:

```json
"trigger": {
    "http": {
        "method": "GET",
        "path": "/",
        "accept": "application/json"
    }
}
```

- **`method`**: Specifies the HTTP method (e.g., `GET`, `POST`, etc.). Use `"*"` to accept **any** method.
- **`path`**: Defines the URL path. Supports **path parameters**:
    - `"/:id"` → Required parameter (e.g., `/cats/123`).
    - `"/:id?"` → Optional parameter (e.g., `/cats` or `/cats/123`).
- **`accept`**: Defines the expected response format (`application/json` by default).

---

### 🔹 2. **Steps Section**

The `steps` define the sequence of nodes executed in the workflow:

```json
"steps": [
    {
        "name": "fetch_api_data",
        "node": "@blok-ts/api-call",
        "type": "module"
    }
]
```

- **`name`**: Unique name for the step.
- **`node`**: The node to execute (e.g., `@blok-ts/api-call`).
- **`type`**: Specifies the type of node. The available options are:
    - **`module`**: Used for nodes installed as dependencies (e.g., from npm) or nodes created using the `Class` type.
    - **`local`**: Used for nodes created locally, typically intended for publishing to npm.

---

### 🔹 3. **Nodes Section**

The `nodes` section configures each node used in the workflow:

```json
"nodes": {
    "fetch_api_data": {
        "inputs": {
            "url": "https://catfact.ninja/fact",
            "method": "GET",
            "headers": {}
        }
    }
}
```

- **`inputs`**: Configuration values for the node.
    - **`url`**: API endpoint.
    - **`method`**: HTTP method (`GET`, `POST`, etc.).
    - **`headers`**: Optional request headers.

---

## 📌 Step 5: Run & Test the Workflow

1. **Start the nanoservice project**:

     ```sh
     npm run dev
     ```

2. **Test the workflow using `curl` or Postman**:

     ```sh
     curl http://localhost:4000/cats
     ```

     ✔ If everything is set up correctly, the response will contain a **random cat fact** fetched from the API. The `/cats` path corresponds to the workflow JSON file **`workflows/json/cats.json`**.

---

## 🎯 Summary

- ✅ Workflows consist of **Triggers**, **Steps**, and **Nodes**.  
- ✅ HTTP triggers support **method filtering (`GET`, `POST`, etc.)** and **dynamic paths (`/:id`)**.  
- ✅ Nodes execute bloks and are configured in the **nodes section**.  
- ✅ Workflows can be tested via `curl` or Postman.  

---

## 🔍 Next Steps

Now that you understand workflows, explore:

- [Context](../Core_Concepts/Context.md)
- [Creating Custom Nodes](../CLI_Commands/Create_Node.md)
- [Creating Workflows](../CLI_Commands/Create_Workflow.md)
- [Examples](../examples.md)
- [Index](../index.md)