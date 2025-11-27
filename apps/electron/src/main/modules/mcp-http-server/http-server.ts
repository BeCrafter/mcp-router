import express, { Express, Request, Response, NextFunction } from 'express';
import { MCPAggregator } from '../mcp-aggregator/aggregator';
import { LogService } from '../log/log.service';
import type {
  JsonRpcRequest,
  JsonRpcResponse,
  MCPRequestMetadata,
} from '@mcp_router/shared/mcp-types';
import { HTTP_SERVER_PORT } from '../../constants';

/**
 * HTTP服务器
 * 提供MCP协议的HTTP端点
 */
export class MCPHttpServer {
  private app: Express;
  private server: ReturnType<Express['listen']> | null = null;
  private aggregator: MCPAggregator;
  private logService: LogService | null = null;

  constructor(aggregator: MCPAggregator, logService?: LogService) {
    this.aggregator = aggregator;
    this.logService = logService || null;
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * 设置中间件
   */
  private setupMiddleware(): void {
    // JSON解析
    this.app.use(express.json());

    // CORS配置
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-MCPR-Project');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    // 请求日志
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`[HTTP] ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * 设置路由
   */
  private setupRoutes(): void {
    // MCP端点
    this.app.post('/mcp', this.handleMCPRequest.bind(this));
  }

  /**
   * 处理MCP请求
   */
  private async handleMCPRequest(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();
    let request: JsonRpcRequest | null = null;
    let response: JsonRpcResponse | null = null;
    let status: 'success' | 'error' = 'success';
    let errorMessage: string | undefined;

    try {
      // Token认证
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        response = {
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32000,
            message: 'Unauthorized: Missing or invalid token',
          },
        };
        res.status(401).json(response);
        status = 'error';
        errorMessage = 'Unauthorized';
        return;
      }

      const token = authHeader.substring(7);
      // TODO: 验证token（阶段6）

      // 提取项目ID
      const projectId = req.headers['x-mcpr-project'] as string | undefined;

      // 提取请求元数据
      const metadata: MCPRequestMetadata = {
        token,
        projectId: projectId || null,
      };

      // 验证JSON-RPC请求格式
      request = req.body as JsonRpcRequest;
      if (!request.jsonrpc || request.jsonrpc !== '2.0' || !request.method) {
        response = {
          jsonrpc: '2.0',
          id: request.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request',
          },
        };
        res.status(400).json(response);
        status = 'error';
        errorMessage = 'Invalid Request';
        return;
      }

      // 处理请求
      let result: unknown;
      switch (request.method) {
        case 'tools/list':
          result = { tools: await this.aggregator.listTools(metadata) };
          break;
        case 'tools/call':
          result = await this.aggregator.callTool(request as any, metadata);
          break;
        case 'resources/list':
          result = { resources: await this.aggregator.listResources(metadata) };
          break;
        case 'resources/read':
          result = await this.aggregator.readResource(request as any, metadata);
          break;
        case 'prompts/list':
          result = { prompts: await this.aggregator.listPrompts(metadata) };
          break;
        case 'prompts/get':
          result = await this.aggregator.getPrompt(request as any, metadata);
          break;
        default:
          throw new Error(`不支持的方法: ${request.method}`);
      }

      response = {
        jsonrpc: '2.0',
        id: request.id,
        result,
      };

      res.json(response);
    } catch (error) {
      console.error('处理MCP请求失败:', error);
      status = 'error';
      errorMessage = error instanceof Error ? error.message : 'Internal error';
      request = req.body as JsonRpcRequest;
      response = {
        jsonrpc: '2.0',
        id: request?.id || null,
        error: {
          code: -32603,
          message: errorMessage,
        },
      };
      res.status(500).json(response);
    } finally {
      // 记录日志
      if (this.logService && request) {
        const duration = Date.now() - startTime;
        this.logService.writeLog({
          requestType: request.method || 'unknown',
          params: request.params,
          response: response?.result || response?.error,
          duration,
          status,
          error: errorMessage,
        });
      }
    }
  }

  /**
   * 启动HTTP服务器
   */
  async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(HTTP_SERVER_PORT, () => {
          console.log(`[HTTP Server] 启动成功，监听端口 ${HTTP_SERVER_PORT}`);
          resolve();
        });

        this.server.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EADDRINUSE') {
            console.error(`[HTTP Server] 端口 ${HTTP_SERVER_PORT} 已被占用`);
            reject(new Error(`端口 ${HTTP_SERVER_PORT} 已被占用`));
          } else {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 停止HTTP服务器
   */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log('[HTTP Server] 已停止');
          this.server = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

