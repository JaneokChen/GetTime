import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import http from "http";

const server = new McpServer({
  name: "my-dev-mcp-server",
  version: "1.0.0",
});
