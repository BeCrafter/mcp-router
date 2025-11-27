#!/usr/bin/env node

/**
 * MCP Router CLI
 */

import { connectCommand } from './commands/connect.js';
import { serveCommand } from './commands/serve.js';

function showHelp(): void {
  console.log(`
MCP Router CLI

用法:
  mcpr <command> [options]

命令:
  connect    连接到 MCP Router HTTP 服务器
  serve      启动 HTTP 服务器，聚合多个 stdio MCP 服务器

选项:
  --help, -h    显示帮助信息
  --version, -v 显示版本信息

示例:
  mcpr connect
  mcpr connect --project my-project
  mcpr serve --port 8080 --server name1 cmd1 --server name2 cmd2

环境变量:
  MCPR_URL      MCP Router HTTP服务器URL (默认: http://localhost:3282/mcp)
  MCPR_TOKEN    Token认证 (必需)
  MCPR_PROJECT  项目名称 (可选)

更多信息请访问: https://github.com/BeCrafter/mcp-router
`);
}

function parseArgs(args: string[]): {
  command: string;
  options: Record<string, string | string[]>;
} {
  const command = args[0];
  const options: Record<string, string | string[]> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.substring(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith('--')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = 'true';
      }
    }
  }

  // 解析 --server 参数（可能有多个）
  if (command === 'serve') {
    const servers: Array<{ name: string; command: string; args: string[] }> = [];
    for (let i = 1; i < args.length; i++) {
      if (args[i] === '--server' && i + 1 < args.length) {
        const name = args[i + 1];
        const command = args[i + 2];
        const argsList: string[] = [];
        let j = i + 3;
        while (j < args.length && !args[j].startsWith('--')) {
          argsList.push(args[j]);
          j++;
        }
        servers.push({ name, command, args: argsList });
        i = j - 1;
      }
    }
    if (servers.length > 0) {
      options.servers = servers as any;
    }
  }

  return { command, options };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log('0.1.0');
    process.exit(0);
  }

  const { command, options } = parseArgs(args);

  try {
    switch (command) {
      case 'connect':
        await connectCommand({
          project: options.project as string,
          token: options.token as string,
        });
        break;
      case 'serve':
        await serveCommand({
          port: options.port ? parseInt(options.port as string, 10) : undefined,
          servers: options.servers as any,
        });
        break;
      default:
        console.error(`错误: 未知命令 "${command}"`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('错误:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

