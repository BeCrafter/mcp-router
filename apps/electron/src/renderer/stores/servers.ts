import { defineStore } from 'pinia';
import type { Server } from '@mcp_router/shared/types';

/**
 * Servers Store
 * 管理MCP服务器的状态
 */
export const useServersStore = defineStore('servers', {
  state: (): {
    servers: Server[];
    loading: boolean;
    error: string | null;
  } => ({
    servers: [],
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * 获取启用的服务器
     */
    enabledServers(): Server[] {
      return this.servers.filter((s) => s.enabled);
    },

    /**
     * 根据ID获取服务器
     */
    getServerById: (state) => (id: string) => {
      return state.servers.find((s) => s.id === id) || null;
    },
  },

  actions: {
    /**
     * 获取服务器列表
     */
    async fetchServers(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const servers = await window.platformAPI.servers.list();
        this.servers = servers as Server[];
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取服务器列表失败';
        console.error('获取服务器列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 创建服务器
     */
    async createServer(data: {
      name: string;
      transport: 'stdio' | 'http' | 'sse';
      config: Server['config'];
      enabled?: boolean;
    }): Promise<Server> {
      try {
        const server = await window.platformAPI.servers.create(data);
        this.servers.push(server);
        return server;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建服务器失败';
        throw error;
      }
    },

    /**
     * 更新服务器
     */
    async updateServer(id: string, updates: Partial<Server>): Promise<void> {
      try {
        const updated = await window.platformAPI.servers.update(id, updates);
        if (updated) {
          const index = this.servers.findIndex((s) => s.id === id);
          if (index !== -1) {
            this.servers[index] = updated;
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新服务器失败';
        throw error;
      }
    },

    /**
     * 删除服务器
     */
    async deleteServer(id: string): Promise<void> {
      try {
        const success = await window.platformAPI.servers.delete(id);
        if (success) {
          this.servers = this.servers.filter((s) => s.id !== id);
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除服务器失败';
        throw error;
      }
    },

    /**
     * 启用/禁用服务器
     */
    async toggleServer(id: string, enabled: boolean): Promise<void> {
      try {
        const success = await window.platformAPI.servers.toggle(id, enabled);
        if (success) {
          const server = this.servers.find((s) => s.id === id);
          if (server) {
            server.enabled = enabled;
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '切换服务器状态失败';
        throw error;
      }
    },
  },
});

