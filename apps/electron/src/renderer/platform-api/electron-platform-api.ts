import { ipcRenderer } from 'electron';
import type { IPlatformAPI } from '@mcp_router/shared/platform-api';

/**
 * Electron Platform API 实现
 * 通过IPC调用Main Process的功能
 */
export class ElectronPlatformAPI implements IPlatformAPI {
  settings = {
    get: async () => {
      return await ipcRenderer.invoke('settings:get');
    },
    save: async (settings: Record<string, unknown>) => {
      return await ipcRenderer.invoke('settings:save', settings);
    },
  };

  servers = {
    list: async () => {
      return await ipcRenderer.invoke('servers:list');
    },
    create: async (server: unknown) => {
      return await ipcRenderer.invoke('servers:create', server);
    },
    update: async (id: string, updates: unknown) => {
      return await ipcRenderer.invoke('servers:update', id, updates);
    },
    delete: async (id: string) => {
      return await ipcRenderer.invoke('servers:delete', id);
    },
    toggle: async (id: string, enabled: boolean) => {
      return await ipcRenderer.invoke('servers:toggle', id, enabled);
    },
  };

  workspaces = {
    list: async () => {
      return await ipcRenderer.invoke('workspaces:list');
    },
    create: async (workspace: unknown) => {
      return await ipcRenderer.invoke('workspaces:create', workspace);
    },
    switch: async (id: string) => {
      return await ipcRenderer.invoke('workspaces:switch', id);
    },
    update: async (id: string, updates: unknown) => {
      return await ipcRenderer.invoke('workspaces:update', id, updates);
    },
    delete: async (id: string) => {
      return await ipcRenderer.invoke('workspaces:delete', id);
    },
  };

  projects = {
    list: async () => {
      return await ipcRenderer.invoke('projects:list');
    },
    create: async (project: unknown) => {
      return await ipcRenderer.invoke('projects:create', project);
    },
    update: async (id: string, updates: unknown) => {
      return await ipcRenderer.invoke('projects:update', id, updates);
    },
    delete: async (id: string) => {
      return await ipcRenderer.invoke('projects:delete', id);
    },
    addServer: async (projectId: string, serverId: string) => {
      return await ipcRenderer.invoke('projects:addServer', projectId, serverId);
    },
    removeServer: async (projectId: string, serverId: string) => {
      return await ipcRenderer.invoke('projects:removeServer', projectId, serverId);
    },
  };

  apps = {
    list: async () => {
      return await ipcRenderer.invoke('apps:list');
    },
    create: async (app: unknown) => {
      return await ipcRenderer.invoke('apps:create', app);
    },
    generateToken: async (appId: string) => {
      return await ipcRenderer.invoke('apps:generateToken', appId);
    },
    revokeToken: async (appId: string) => {
      return await ipcRenderer.invoke('apps:revokeToken', appId);
    },
  };

  logs = {
    query: async (options?: {
      startDate?: string;
      endDate?: string;
      serverId?: string;
      requestType?: string;
      status?: 'success' | 'error';
    }) => {
      return await ipcRenderer.invoke('logs:query', options);
    },
    read: async (params: { date: string }) => {
      return await ipcRenderer.invoke('logs:read', params);
    },
    cleanup: async () => {
      return await ipcRenderer.invoke('logs:cleanup');
    },
  };

  workflows = {
    list: async () => {
      return await ipcRenderer.invoke('workflows:list');
    },
    get: async (id: string) => {
      return await ipcRenderer.invoke('workflows:get', { id });
    },
    create: async (workflow: {
      name: string;
      description?: string;
      triggerType: 'tools/list' | 'tools/call' | 'manual';
      nodes?: any[];
      edges?: any[];
    }) => {
      return await ipcRenderer.invoke('workflows:create', workflow);
    },
    update: async (id: string, updates: unknown) => {
      return await ipcRenderer.invoke('workflows:update', { id, updates });
    },
    delete: async (id: string) => {
      return await ipcRenderer.invoke('workflows:delete', { id });
    },
    toggle: async (id: string, enabled: boolean) => {
      return await ipcRenderer.invoke('workflows:toggle', { id, enabled });
    },
    execute: async (id: string, context?: Record<string, unknown>) => {
      return await ipcRenderer.invoke('workflows:execute', { id, context });
    },
  };

  clients = {
    list: async () => {
      return await ipcRenderer.invoke('clients:list');
    },
    get: async (id: string) => {
      return await ipcRenderer.invoke('clients:get', { id });
    },
    create: async (client: { name: string; type: 'predefined' | 'custom' }) => {
      return await ipcRenderer.invoke('clients:create', client);
    },
    update: async (id: string, updates: unknown) => {
      return await ipcRenderer.invoke('clients:update', { id, updates });
    },
    delete: async (id: string) => {
      return await ipcRenderer.invoke('clients:delete', { id });
    },
    generateToken: async (id: string) => {
      return await ipcRenderer.invoke('clients:generate-token', { id });
    },
    revokeToken: async (id: string) => {
      return await ipcRenderer.invoke('clients:revoke-token', { id });
    },
  };

  packages = {
    list: async () => {
      return await ipcRenderer.invoke('packages:list');
    },
  };

  auth = {
    // 预留接口
  };
}

