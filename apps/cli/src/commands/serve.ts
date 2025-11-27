#!/usr/bin/env node

/**
 * Serve命令
 * 聚合多个stdio MCP服务器并暴露 via HTTP
 */

import express from 'express';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const DEFAULT_PORT = 3283;

/**
 * 启动HTTP服务器，聚合stdio MCP服务器
 */
export async function serveCommand(options: {
  port?: number;
  servers?: Array<{ name: string; command: string; args: string[] }>;
}): Promise<void> {
  const port = options.port || DEFAULT_PORT;
  const servers = options.servers || [];

  if (servers.length === 0) {
    console.error('错误: 需要指定至少一个服务器');
    console.error('用法: mcpr serve --server name1 cmd1 --server name2 cmd2');
    process.exit(1);
  }

  console.error(`[MCP Router CLI] 启动HTTP服务器，端口: ${port}`);
  console.error(`[MCP Router CLI] 聚合 ${servers.length} 个服务器`);

  const app = express();
  app.use(express.json());

  // 存储客户端连接
  const clients = new Map<string, Client>();

  // 连接到所有stdio服务器
  for (const server of servers) {
    try {
      const transport = new StdioClientTransport({
        command: server.command,
        args: server.args,
        env: {},
      });

      const client = new Client(
        {
          name: `mcp-router-serve-${server.name}`,
          version: '0.1.0',
        },
        {
          capabilities: {},
        }
      );

      await client.connect(transport);
      clients.set(server.name, client);
      console.error(`[MCP Router CLI] 已连接服务器: ${server.name}`);
    } catch (error) {
      console.error(`[MCP Router CLI] 连接服务器 ${server.name} 失败:`, error);
    }
  }

  // TODO: 实现HTTP端点
  // 1. 聚合所有服务器的工具
  // 2. 处理HTTP MCP请求
  // 3. 路由到正确的stdio服务器

  app.post('/mcp', (req, res) => {
    res.json({
      jsonrpc: '2.0',
      id: req.body.id,
      error: {
        code: -32601,
        message: 'Serve命令尚未完全实现',
      },
    });
  });

  app.listen(port, () => {
    console.error(`[MCP Router CLI] HTTP服务器已启动: http://localhost:${port}/mcp`);
  });
}

