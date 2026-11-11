import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio";
async function runClient() {
  console.log("启动 MCP 客户端...");

  try {
    // 创建客户端与服务端的通信通道，使用子进程运行 MCP 服务端
    const transport = new StdioClientTransport({
      command: "node",
      args: ["./src/server.js"], // 指定 MCP 服务端入口文件
    });

    const client = new Client({
      name: "mcp_client_get_time",
      version: "1.0.0",
    });

    console.log("连接到 MCP 服务器...");
    await client.connect(transport);
    console.log("成功连接到 MCP 服务器");
  } catch (e) {}
}
