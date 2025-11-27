import { contextBridge, ipcRenderer } from 'electron';
import type { IPlatformAPI } from '@mcp_router/shared/platform-api';

// 创建Platform API实现
const platformAPI: IPlatformAPI = {
  settings: {
    get: async () => ipcRenderer.invoke('settings:get'),
    save: async (settings: Record<string, unknown>) =>
      ipcRenderer.invoke('settings:save', settings),
  },
  servers: {
    list: async () => ipcRenderer.invoke('servers:list'),
    create: async (server: unknown) => ipcRenderer.invoke('servers:create', server),
    update: async (id: string, updates: unknown) =>
      ipcRenderer.invoke('servers:update', id, updates),
    delete: async (id: string) => ipcRenderer.invoke('servers:delete', id),
    toggle: async (id: string, enabled: boolean) =>
      ipcRenderer.invoke('servers:toggle', id, enabled),
  },
  workspaces: {
    list: async () => ipcRenderer.invoke('workspaces:list'),
    create: async (workspace: unknown) => ipcRenderer.invoke('workspaces:create', workspace),
    switch: async (id: string) => ipcRenderer.invoke('workspaces:switch', id),
    update: async (id: string, updates: unknown) =>
      ipcRenderer.invoke('workspaces:update', id, updates),
    delete: async (id: string) => ipcRenderer.invoke('workspaces:delete', id),
  },
  projects: {
    list: async () => ipcRenderer.invoke('projects:list'),
    create: async (project: unknown) => ipcRenderer.invoke('projects:create', project),
    update: async (id: string, updates: unknown) =>
      ipcRenderer.invoke('projects:update', id, updates),
    delete: async (id: string) => ipcRenderer.invoke('projects:delete', id),
    addServer: async (projectId: string, serverId: string) =>
      ipcRenderer.invoke('projects:addServer', projectId, serverId),
    removeServer: async (projectId: string, serverId: string) =>
      ipcRenderer.invoke('projects:removeServer', projectId, serverId),
  },
  apps: {
    list: async () => ipcRenderer.invoke('apps:list'),
    create: async (app: unknown) => ipcRenderer.invoke('apps:create', app),
    generateToken: async (appId: string) => ipcRenderer.invoke('apps:generateToken', appId),
    revokeToken: async (appId: string) => ipcRenderer.invoke('apps:revokeToken', appId),
  },
  logs: {
    list: async (params?: { startDate?: Date; endDate?: Date; serverId?: string }) =>
      ipcRenderer.invoke('logs:list', params),
    search: async (query: string) => ipcRenderer.invoke('logs:search', query),
  },
  workflows: {
    list: async () => ipcRenderer.invoke('workflows:list'),
    create: async (workflow: unknown) => ipcRenderer.invoke('workflows:create', workflow),
    update: async (id: string, updates: unknown) =>
      ipcRenderer.invoke('workflows:update', id, updates),
    delete: async (id: string) => ipcRenderer.invoke('workflows:delete', id),
    execute: async (id: string, context: unknown) =>
      ipcRenderer.invoke('workflows:execute', id, context),
  },
  packages: {
    list: async () => ipcRenderer.invoke('packages:list'),
  },
  auth: {},
};

// 暴露Platform API到渲染进程
contextBridge.exposeInMainWorld('platformAPI', platformAPI);

