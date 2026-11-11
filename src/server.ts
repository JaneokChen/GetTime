import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import http from "http";

const server = new McpServer({
  name: "my-dev-mcp-server",
  version: "1.0.0",
});

// 注册工具_获取时间
server.registerTool(
  "getTime",
  {
    description:
      "获取当前时间，支持多种格式和本地化设置。format 参数控制时间显示格式",
    inputSchema: z.object({
      format: z.enum(["iso", "utc", "full"]).optional(),
    }).shape,
  },
  async (tool) => {
    const { format } = tool || {};
    let timeString;

    if (format === "iso") {
      timeString = new Date().toISOString();
    } else if (format === "utc") {
      timeString = new Date().toUTCString();
    } else if (format === "full") {
      timeString = new Date().toLocaleString("zh-CN");
    } else {
      timeString = new Date().toString();
    }

    return {
      content: [{ type: "text", text: timeString }],
    };
  },
);

// 创建 http 资源服务器
const PORT = 3000;
const resourceServer = http.createServer((req, res) => {
  if (req.url === "/server-info.json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify(
        {
          name: "mcp-server-demo",
          version: "1.0.0",
          capabilities: ["tools", "resources", "prompts"],
        },
        null,
        2,
      ),
    );
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

resourceServer.listen(PORT, () => {
  console.log(`Resource server listening on http://localhost:${PORT}`);
});
