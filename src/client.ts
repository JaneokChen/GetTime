import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function runClient() {
  console.log("启动 MCP 客户端...");

  try {
    // 创建客户端与服务端的通信通道，使用子进程运行 MCP 服务端
    const transport = new StdioClientTransport({
      command: "node",
      args: ["./src/server.ts"], // 指定 MCP 服务端入口文件
    });

    const client = new Client({
      name: "mcp_client_get_time",
      version: "1.0.0",
    });

    console.log("连接到 MCP 服务器...");
    await client.connect(transport);
    console.log("成功连接到 MCP 服务器");

    // ------------------ 调用工具 ------------------
    console.log("\n可用工具:");
    const tools = await client.listTools();
    tools.tools.forEach((tools, index) => {
      console.log(`${index + 1}.${tools.name}:${tools.description}`);
    });
    const toolName =
      tools.tools.length > 0 ? tools.tools[0].name : "mcpDemo_getTime";

    // 测试调用工具：不带参数
    console.log("\n测试 1：不带参数调用工具...");
    let result = await client.callTool({ name: toolName });
    console.log("调用结果：", result);

    // 测试调用工具：format="iso"
    console.log("\n测试 2：使用 format='iso' 调用工具...");
    result = await client.callTool({
      name: toolName,
      arguments: {
        format: "iso",
      },
    });
    console.log("调用结果：", result);

    console.log("\n测试 3：使用 format='utc' 调用工具...");
    result = await client.callTool({
      name: toolName,
      arguments: {
        format: "utc",
      },
    });
    console.log("调用结果：", result);

    // ------------------ 读取资源 ------------------
    console.log("\n可用资源：");
    try {
      const resources = await client.listResources();
      resources.resources.forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.name}：${resource.description}`);
      });

      if (resources.resources.length > 0) {
        console.log("\n读取第一个资源内容：");
        const resourceContent = await client.readResource({
          uri: resources.resources[0].uri,
        });
        console.log("资源内容：", resourceContent);
      }
    } catch (error) {
      console.log("暂无可用资源或读取资源出错：", (error as Error).message);
    }

    // ------------------ 获取提示 ------------------
    console.log("\n可用提示：");
    try {
      const prompts = await client.listPrompts(); // 列出注册提示
      prompts.prompts.forEach((prompt, index) => {
        console.log(`${index + 1}. ${prompt.name}: ${prompt.description}`);
      });

      if (prompts.prompts.length > 0) {
        console.log("\n获取第一个提示结果：");
        const promptResult = await client.getPrompt({
          name: prompts.prompts[0].name,
          arguments: {
            question: "现在几点了？",
          },
        });
        console.log("提示结果：");
        console.log(JSON.stringify(promptResult, null, 2));
      }
    } catch (error) {
      console.log("暂无可用提示或读取资源出错：", (error as Error).message);
    }

    console.log("\n 测试完成，退出程序");

    // 关闭连接（同时结束服务端子进程），避免父进程因子进程/HTTP 服务句柄而无法退出
    await client.close();
    process.exit(0);
  } catch (error) {
    console.log("MCP 客户端运行出错：", error);
    process.exit(1);
  }
}

// 启动客户端
runClient();
