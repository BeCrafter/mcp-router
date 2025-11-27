import { ipcHandlerRegistry } from '../../infrastructure/ipc';
import { ServerService } from './server.service';
import { MCPClientManager } from './mcp-client-manager';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import type { Server } from '@mcp_router/shared/types';

/**
 * Server IPC Handlers
 * 注册服务器管理相关的IPC处理函数
 */
export function setupServerHandlers(
  dbManager: SqliteManager,
  clientManager: MCPClientManager
): void {
  const serverService = new ServerService(dbManager);

  // 获取服务器列表
  ipcHandlerRegistry.register<null, Server[]>('servers:list', async () => {
    return serverService.listServers();
  });

  // 创建服务器
  ipcHandlerRegistry.register<
    {
      name: string;
      transport: 'stdio' | 'http' | 'sse';
      config: Server['config'];
      enabled?: boolean;
    },
    Server
  >('servers:create', async (_, data) => {
    const server = serverService.createServer(data);
    // 如果启用，尝试连接
    if (server.enabled) {
      try {
        await clientManager.connect(server);
      } catch (error) {
        console.error(`创建服务器后连接失败:`, error);
        // 连接失败不影响服务器创建
      }
    }
    return server;
  });

  // 更新服务器
  ipcHandlerRegistry.register<
    { id: string; updates: Partial<Server> },
    Server | null
  >('servers:update', async (_, { id, updates }) => {
    const existing = serverService.getServerById(id);
    if (!existing) {
      return null;
    }

    const updated = serverService.updateServer(id, updates);
    if (!updated) {
      return null;
    }

    // 如果启用状态改变，更新连接
    if (updates.enabled !== undefined && updates.enabled !== existing.enabled) {
      if (updates.enabled) {
        try {
          await clientManager.connect(updated);
        } catch (error) {
          console.error(`启用服务器后连接失败:`, error);
        }
      } else {
        await clientManager.disconnect(id);
      }
    }

    return updated;
  });

  // 删除服务器
  ipcHandlerRegistry.register<string, boolean>('servers:delete', async (_, id) => {
    // 先断开连接
    await clientManager.disconnect(id);
    return serverService.deleteServer(id);
  });

  // 启用/禁用服务器
  ipcHandlerRegistry.register<
    { id: string; enabled: boolean },
    boolean
  >('servers:toggle', async (_, { id, enabled }) => {
    const success = serverService.toggleServer(id, enabled);
    if (!success) {
      return false;
    }

    const server = serverService.getServerById(id);
    if (!server) {
      return false;
    }

    if (enabled) {
      try {
        await clientManager.connect(server);
      } catch (error) {
        console.error(`启用服务器后连接失败:`, error);
        // 连接失败时禁用服务器
        serverService.toggleServer(id, false);
        return false;
      }
    } else {
      await clientManager.disconnect(id);
    }

    return true;
  });

  // 获取服务器工具列表
  ipcHandlerRegistry.register<string, Array<{ name: string; enabled: boolean }>>(
    'servers:tools',
    async (_, serverId) => {
      const clientInfo = clientManager.getAllClients().get(serverId);
      return clientInfo?.tools || [];
    }
  );
}

