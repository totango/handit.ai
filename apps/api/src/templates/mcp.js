// File: .handit/mcp-server.js

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, "handit.config.json");
const rulesJSPath = path.join(__dirname, "cursor_rules-js.json");
const rulesPythonPath = path.join(__dirname, "cursor_rules-python.json");
const llmsJSPath = path.join(__dirname, "llms.js.txt");
const llmsPythonPath = path.join(__dirname, "llms.python.txt");

console.error("🚀 Loading Handit MCP server...");

let config, rulesJS, rulesPython, llmsJS, llmsPython;
try {
  config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  rulesJS = JSON.parse(fs.readFileSync(rulesJSPath, "utf8"));
  rulesPython = JSON.parse(fs.readFileSync(rulesPythonPath, "utf8"));
  llmsJS = fs.readFileSync(llmsJSPath, "utf8");
  llmsPython = fs.readFileSync(llmsPythonPath, "utf8");
  console.error("✅ Configs loaded successfully");
} catch (err) {
  console.error("❌ Error loading config files:", err.message);
  process.exit(1);
}



const server = new McpServer({
  name: "Handit MCP",
  version: "1.0.0",
});

console.error("🛠️ Registering tools...");
server.tool(
  "handit",
  z.object({}),
  async () => {
    const output = `Configured Handit AI agent: ${config.agent.slug}`;
    return {
      content: [
        {
          type: "text",
          text: output,
        },
      ],
    };
  }
);

console.error("📚 Registering contextual resource...");
server.resource(
  "handit-context",
  new ResourceTemplate("handit://context", { list: undefined }),
  async () => {
    const content = `
# Handit Agent Context

## Agent
Name: ${config.agent.name}
Slug: ${config.agent.slug}
Description: ${config.agent.description}

## Nodes
${config.nodes.map(n => `- ${n.slug} (${n.type}): ${n.description}`).join("\n")}

## Rules for JavaScript
\`\`\`json
${JSON.stringify(rulesJS, null, 2)}
\`\`\`

## Rules for Python
\`\`\`json
${JSON.stringify(rulesPython, null, 2)}
\`\`\`


## LLM Prompt Template
\`\`\`
${llmsJS}
\`\`\`

## LLM Prompt Template for Python
\`\`\`
${llmsPython}
\`\`\`
    `;

    return {
      contents: [
        {
          uri: "handit://context",
          text: content.trim(),
        },
      ],
    };
  }
);

console.error("🔌 Connecting MCP transport...");
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("✅ MCP server connected and running");