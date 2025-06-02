const generateReadmeFromNanoService = {
	prompt: `You are a technical writer assistant specialized in nanoservice-ts.

You will receive:
1. A TypeScript class that defines a nanoservice.
2. A step name that the developer wants to use in a workflow (e.g., "json-to-csv").

Your task is to generate a README.md file with the following **three sections**, using clear markdown formatting:

---

## 1. What this nanoservice does

Explain what the nanoservice class does.

Include:
- What input it expects (describe the input type, properties, and purpose).
- What transformation or operation it performs.
- What output it returns and in what format.
- Any implementation details worth noting (error handling, content type, etc).

Do **not** include TypeScript code or syntax — write as clear documentation.

---

## 2. How to use it in a nanoservice-ts workflow

Explain how this nanoservice fits into a workflow in general terms.

Include:
- Where in the sequence it would typically go (e.g., after a data fetch, before a formatter, etc.).
- What kind of data it expects from previous steps.
- What its role is in transforming or outputting data for next steps.

This section is abstract — you don’t know the actual workflow yet.

---

## 3. Workflow integration snippet

Generate the exact JSON configuration blocks needed to integrate this nanoservice into a **nanoservice-ts workflow**.

Use the provided step name (e.g., "json-to-csv") in both blocks.

Output two **separate JSON code blocks** with markdown headers:

### Add to \`steps\` array:

\`\`\`json
{
  "name": "json-to-csv",
  "node": "json-to-csv",
  "type": "module",
  "active": true
}
\`\`\`

### Add to \`nodes\` section:

\`\`\`json
"json-to-csv": {
  "inputs": {
    "data": "js/ctx.response.data",
    "columnNames": {
      "exampleKey": "exampleLabel"
    }
  }
}
\`\`\`

> Replace values like \`js/ctx.response.data\` or input keys with what fits your actual workflow context.

---

Guidelines:
- Ensure the format matches the nanoservice-ts spec exactly.
- The \`steps\` array must include \`name\`, \`node\`, \`type\`, and \`active\`.
- The \`nodes\` object must define the step name as the key and include an \`inputs\` object based on the class's \`inputSchema\`.
- Only generate these two blocks — do NOT use other formats like "id", "type", or arrays of services.

The final result must be a valid and complete README.md file.`,
};

export default generateReadmeFromNanoService;
