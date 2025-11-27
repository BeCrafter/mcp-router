import { ipcHandlerRegistry } from '../../infrastructure/ipc';
import { ProjectService } from './project.service';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import type { Project } from '@mcp_router/shared/types';

// 导出ProjectService以便在其他模块中使用
export { ProjectService };

// 导出ProjectService以便在其他模块中使用
export { ProjectService };

/**
 * Project IPC Handlers
 * 注册项目管理相关的IPC处理函数
 */
export function setupProjectHandlers(dbManager: SqliteManager): ProjectService {
  const projectService = new ProjectService(dbManager);

  // 获取项目列表
  ipcHandlerRegistry.register<null, Project[]>('projects:list', async () => {
    return projectService.listProjects();
  });

  // 创建项目
  ipcHandlerRegistry.register<
    { name: string; description?: string },
    Project
  >('projects:create', async (_, data) => {
    return projectService.createProject(data);
  });

  // 更新项目
  ipcHandlerRegistry.register<
    { id: string; updates: Partial<Project> },
    Project | null
  >('projects:update', async (_, { id, updates }) => {
    return projectService.updateProject(id, updates);
  });

  // 删除项目
  ipcHandlerRegistry.register<string, boolean>('projects:delete', async (_, id) => {
    return projectService.deleteProject(id);
  });

  // 添加服务器到项目
  ipcHandlerRegistry.register<
    { projectId: string; serverId: string },
    void
  >('projects:addServer', async (_, { projectId, serverId }) => {
    projectService.addServerToProject(projectId, serverId);
  });

  // 从项目移除服务器
  ipcHandlerRegistry.register<
    { projectId: string; serverId: string },
    void
  >('projects:removeServer', async (_, { projectId, serverId }) => {
    projectService.removeServerFromProject(projectId, serverId);
  });

  return projectService;
}

