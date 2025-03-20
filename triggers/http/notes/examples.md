# Nanoservice-TS Examples

This examples provide a collection of workflows and nanoservices built with **Nanoservice-TS**, showcasing real-world use cases for building scalable, reusable, and modular backend services.

## 🚀 Getting Started

### Prerequisites
- **Node.js** (Latest LTS version recommended)
- **Docker & Docker Compose** (For running PostgreSQL instances)
- **MongoDB** (For MongoDB-related examples)
- **Nanoservice-TS CLI** (If available, install it globally)
- **OpenAI API Key**: Required for workflows that utilize OpenAI services. Ensure you have a valid API key set in your environment variables.

## 📌 Workflows

The repository contains the following workflows:

| Workflow | Description |
|----------|-------------|
| **countries-vs-facts.json** | Calls either a Countries API or a Cat Facts API |
| **countries.json** | Retrieves country and city data from an API |
| **dashboard-gen.json** | Generates insights and charts from PostgreSQL schema using OpenAI |
| **db-manager.json** | SQL Query generator using OpenAI prompts with a web admin interface |
| **films.json** | API to list films |
| **launches-by-year.json** | Retrieves space launch data by year |
| **mongodb.json** | REST API for MongoDB queries |
| **workflow-docs.json** | Uses OpenAI to generate documentation for workflow JSON files |

---

## 🛠 Nanoservices

These nanoservices are used within the workflows to handle specific tasks:

| Nanoservice | Description |
|------------|-------------|
| **mongodb-query.ts** | Executes queries on MongoDB |
| **DirectoryManager.ts** | Retrieves the list of files in a directory |
| **ErrorNode.ts** | Returns an error |
| **FileManager.ts** | Reads the content of a file |
| **OpenAI.ts** | Sends prompts to OpenAI |
| **workflow-docs/ui/index.ts** | UI for workflow documentation (EJS, TailwindCSS, ReactJS) |
| **postgres-query/index.ts** | Executes PostgreSQL queries |
| **MapperNode.ts** | Performs data transformation |
| **QueryGeneratorNode.ts** | Uses OpenAI to generate PostgreSQL queries from a prompt |
| **db-manager/ui/index.ts** | Web admin interface for database queries (EJS, TailwindCSS, ReactJS) |
| **ArrayMap.ts** | Transforms items within an array |
| **DashboardChartGenerator.ts** | Uses OpenAI to generate charts using Chart.js |
| **MemoryStorage.ts** | In-memory key-value store |
| **MultipleQueryGeneratorNode.ts** | Uses OpenAI to generate PostgreSQL queries for dashboard charts |
| **dashboard-generator/ui/index.ts** | Dashboard generator UI (EJS, TailwindCSS, ReactJS) |

---

## 🏗 Infrastructure

This repository includes a **Docker Compose** setup to run a PostgreSQL database for testing workflows that require a database.

### Start PostgreSQL Instance
```sh
cd infra
docker-compose up -d
```

### Stop PostgreSQL Instance
```sh
cd infra
docker-compose down
```

---

### Required Environment Variables
Before running the workflows, ensure you have the following environment variables set:
```sh
export OPENAI_API_KEY=your_openai_api_key
export MONGODB_URI=your_mongodb_connection_string
export MONGODB_DATABASE=your_database_name
```

---

### Testing in Browser
To test a workflow, open your browser and navigate to:
```
http://localhost:4000/{workflow-file-name}
```
Replace `{workflow-file-name}` with the actual file name of the workflow **without the extension**.

For example, to test `countries.json`, navigate to:
```
http://localhost:4000/countries
```

---

## 🔍 Next Steps

Now that you understand the basics, dive deeper into `nanoservice-ts` with the following resources:

- [Context](./Core_Concepts/Context.md)
- [Creating Workflows](./CLI_Commands/Create_Workflow.md)  
- [Creating Custom Nodes](./CLI_Commands/Create_Node.md)
- [Index](./index.md)