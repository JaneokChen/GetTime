一个用来看时间的小工具

## 项目结构

```
src/
├── server.ts   # MCP 服务端
└── client.ts   # MCP 客户端（测试脚本）
```

## 服务端 (`src/server.ts`)

注册了 MCP 的三大能力，通过 **STDIO** 传输与客户端通信：

| 能力 | 名称 | 说明 |
|------|------|------|
| Tool | `get_time` | 获取当前时间，支持 `iso` / `utc` / `full`（中文本地化）/ 默认格式 |
| Resource | `server_info` | 服务器信息，另起了一个 HTTP 服务（端口 3000）暴露 `/server_info.json` |
| Prompt | `time_query` | 接收 `question` 参数，返回「用户询问 + 当前时间」的结构化消息 |

依赖 `@modelcontextprotocol/server`（新版 SDK）、`zod` 做参数校验。

## 客户端 (`src/client.ts`)

一个端到端的测试脚本，会以子进程方式拉起服务端，然后依次：

1. 列出并调用工具（三种参数组合测试）
2. 列出并读取资源
3. 列出并获取提示

## 运行方式

```bash
pnpm start:server   # 单独启动服务端
pnpm start:client   # 跑客户端测试
```
