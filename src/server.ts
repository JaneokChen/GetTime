import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import http from "http";

const server = new McpServer({
  name: "mcp_server_get_time",
  version: "1.0.0",
});

// 注册工具_获取时间
server.registerTool(
  "get_time",
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
const SERVER_INFO = {
  name: "mcp_server",
  version: "1.0.0",
  capabilities: ["tools", "resources", "prompts"],
};
const resourceServer = http.createServer((req, res) => {
  if (req.url === "/server_info.json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(SERVER_INFO));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

resourceServer.listen(PORT, () => {
  console.log(`Resource server listening on http://localhost:${PORT}`);
});

// 注册资源
server.registerResource(
  "server_info",
  `http://localhost:${PORT}/server_info.json`,
  {
    description: "服务器信息资源",
    mimeType: "application/json",
  },
  async () => ({
    contents: [
      {
        uri: `http://localhost:${PORT}/server_info.json`,
        mimeType: "application/json",
        text: JSON.stringify(SERVER_INFO, null, 2),
      },
    ],
  }),
);

// 注册提示词
server.registerPrompt(
  "time-query",
  {
    // 2. 配置对象（包含描述和参数 Schema）
    description:
      "帮助用户查询时间的助手提示，接收参数 question，返回用户提问的结构化结果",
    argsSchema: z.object({ question: z.string() }).shape,
  },
  async ({ question }) => {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `用户询问: ${
              question || "当前时间是？"
            }\n助手回答: 当前时间是 ${new Date().toString()}`,
          },
        },
      ],
    };
  },
);

// 使用 STDIO 传输建立与客户端的通信
const transport = new StdioServerTransport();
await server.connect(transport);
