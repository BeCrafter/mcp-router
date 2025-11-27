import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { Server } from '@mcp_router/shared/types';
import { EventEmitter } from 'events';

/**
 * MCP客户端连接状态
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * MCP客户端信息
 */
export interface MCPClientInfo {
  serverId: string;
  client: Client | null;
  status: ConnectionStatus;
  error?: string;
  tools: Array<{ name: string; enabled: boolean }>;
}

/**
 * MCP客户端管理器
 * 管理MCP服务器的连接和生命周期
 */
export class MCPClientManager extends EventEmitter {
  private clients: Map<string, MCPClientInfo> = new Map();

  /**
   * 连接到MCP服务器
   */
  async connect(server: Server): Promise<void> {
    const serverId = server.id;
    let clientInfo = this.clients.get(serverId);

    if (!clientInfo) {
      clientInfo = {
        serverId,
        client: null,
        status: 'disconnected',
        tools: [],
      };
      this.clients.set(serverId, clientInfo);
    }

    if (clientInfo.status === 'connected' || clientInfo.status === 'connecting') {
      return; // 已经连接或正在连接
    }

    try {
      clientInfo.status = 'connecting';
      this.emit('status-change', serverId, 'connecting');

      let client: Client;
      const transport = server.transport;

      if (transport === 'stdio') {
        // stdio传输
        if (!server.config.command) {
          throw new Error('stdio传输需要command配置');
        }
        const stdioTransport = new StdioClientTransport({
          command: server.config.command,
          args: server.config.args || [],
          env: server.config.env,
        });
        client = new Client(
          {
            name: 'mcp-router',
            version: '0.1.0',
          },
          {
            capabilities: {},
          }
        );
        await client.connect(stdioTransport);
      } else if (transport === 'http' || transport === 'sse') {
        // HTTP/SSE传输（后续实现）
        throw new Error(`${transport}传输尚未实现`);
      } else {
        throw new Error(`不支持的传输类型: ${transport}`);
      }

      clientInfo.client = client;
      clientInfo.status = 'connected';
      clientInfo.error = undefined;

      // 获取工具列表
      try {
        const toolsResponse = await client.listTools();
        clientInfo.tools = (toolsResponse.tools || []).map((tool) => ({
          name: tool.name,
          enabled: true,
        }));
      } catch (error) {
        console.error(`获取服务器 ${server.name} 的工具列表失败:`, error);
      }

      this.emit('status-change', serverId, 'connected');
      this.emit('connected', serverId);
    } catch (error) {
      clientInfo.status = 'error';
      clientInfo.error = error instanceof Error ? error.message : String(error);
      clientInfo.client = null;
      this.emit('status-change', serverId, 'error');
      this.emit('error', serverId, error);
      throw error;
    }
  }

  /**
   * 断开MCP服务器连接
   */
  async disconnect(serverId: string): Promise<void> {
    const clientInfo = this.clients.get(serverId);
    if (!clientInfo || !clientInfo.client) {
      return;
    }

    try {
      await clientInfo.client.close();
    } catch (error) {
      console.error(`断开服务器 ${serverId} 连接失败:`, error);
    }

    clientInfo.client = null;
    clientInfo.status = 'disconnected';
    clientInfo.error = undefined;
    this.emit('status-change', serverId, 'disconnected');
    this.emit('disconnected', serverId);
  }

  /**
   * 获取客户端
   */
  getClient(serverId: string): Client | null {
    const clientInfo = this.clients.get(serverId);
    return clientInfo?.client || null;
  }

  /**
   * 获取连接状态
   */
  getStatus(serverId: string): ConnectionStatus {
    const clientInfo = this.clients.get(serverId);
    return clientInfo?.status || 'disconnected';
  }

  /**
   * 获取所有客户端信息
   */
  getAllClients(): Map<string, MCPClientInfo> {
    return new Map(this.clients);
  }

  /**
   * 清理所有连接
   */
  async cleanup(): Promise<void> {
    const disconnectPromises = Array.from(this.clients.keys()).map((serverId) =>
      this.disconnect(serverId)
    );
    await Promise.all(disconnectPromises);
    this.clients.clear();
  }
}

