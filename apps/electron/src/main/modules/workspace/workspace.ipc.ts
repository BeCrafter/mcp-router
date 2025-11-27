import { ipcHandlerRegistry } from '../../infrastructure/ipc';
import { WorkspaceService } from './workspace.service';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import { SchemaManager } from '../../infrastructure/database/schema-manager';
import type { Workspace } from '@mcp_router/shared/types';

/**
 * Workspace IPC Handlers
 * 注册工作区管理相关的IPC处理函数
 */
export function setupWorkspaceHandlers(
  dbManager: SqliteManager,
  schemaManager: SchemaManager
): WorkspaceService {
  const workspaceService = new WorkspaceService(dbManager, schemaManager);

  // 获取工作区列表
  ipcHandlerRegistry.register<null, Workspace[]>('workspaces:list', async () => {
    return workspaceService.listWorkspaces();
  });

  // 创建本地工作区
  ipcHandlerRegistry.register<{ name: string }, Workspace>(
    'workspaces:create',
    async (_, { name }) => {
      return workspaceService.createLocalWorkspace(name);
    }
  );

  // 切换工作区
  ipcHandlerRegistry.register<string, void>('workspaces:switch', async (_, id) => {
    workspaceService.switchWorkspace(id);
    // 通知所有Repository重新初始化（通过事件或直接调用）
    // TODO: 实现Repository重新初始化机制
  });

  // 更新工作区
  ipcHandlerRegistry.register<
    { id: string; updates: Partial<Workspace> },
    Workspace | null
  >('workspaces:update', async (_, { id, updates }) => {
    return workspaceService.updateWorkspace(id, updates);
  });

  // 删除工作区
  ipcHandlerRegistry.register<string, boolean>('workspaces:delete', async (_, id) => {
    return workspaceService.deleteWorkspace(id);
  });

  return workspaceService;
}

