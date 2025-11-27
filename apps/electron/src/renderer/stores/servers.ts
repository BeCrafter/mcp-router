import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Server } from '@mcp_router/shared/types';
import { useCache } from '../composables/useCache';

/**
 * Servers Store
 * 管理MCP服务器的状态（使用Composition API和缓存优化）
 */
export const useServersStore = defineStore('servers', () => {
  // 使用缓存减少IPC调用（5秒TTL）
  const cache = useCache<Server[]>(5000);
  
  // State
  const servers = ref<Server[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const enabledServers = computed(() => 
    servers.value.filter((s) => s.enabled)
  );

  const getServerById = (id: string) => 
    servers.value.find((s) => s.id === id) || null;

  // Actions
  /**
   * 获取服务器列表（带缓存）
   */
  async function fetchServers(force = false): Promise<void> {
    // 检查缓存
    if (!force && cache.has('servers:list')) {
      const cached = cache.get('servers:list');
      if (cached) {
        servers.value = cached;
        return;
      }
    }

    loading.value = true;
    error.value = null;
    try {
      const serverList = await window.platformAPI.servers.list();
      servers.value = serverList as Server[];
      // 更新缓存
      cache.set('servers:list', servers.value);
    } catch (err) {
      error.value = err instanceof Error ? err.message : '获取服务器列表失败';
      console.error('获取服务器列表失败:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 创建服务器
   */
  async function createServer(data: {
    name: string;
    transport: 'stdio' | 'http' | 'sse';
    config: Server['config'];
    enabled?: boolean;
  }): Promise<Server> {
    try {
      const server = await window.platformAPI.servers.create(data);
      servers.value.push(server);
      // 清除缓存
      cache.remove('servers:list');
      return server;
    } catch (err) {
      error.value = err instanceof Error ? err.message : '创建服务器失败';
      throw err;
    }
  }

  /**
   * 更新服务器
   */
  async function updateServer(id: string, updates: Partial<Server>): Promise<void> {
    try {
      const updated = await window.platformAPI.servers.update(id, updates);
      if (updated) {
        const index = servers.value.findIndex((s) => s.id === id);
        if (index !== -1) {
          servers.value[index] = updated;
        }
        // 清除缓存
        cache.remove('servers:list');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新服务器失败';
      throw err;
    }
  }

  /**
   * 删除服务器
   */
  async function deleteServer(id: string): Promise<void> {
    try {
      const success = await window.platformAPI.servers.delete(id);
      if (success) {
        servers.value = servers.value.filter((s) => s.id !== id);
        // 清除缓存
        cache.remove('servers:list');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除服务器失败';
      throw err;
    }
  }

  /**
   * 启用/禁用服务器
   */
  async function toggleServer(id: string, enabled: boolean): Promise<void> {
    try {
      const success = await window.platformAPI.servers.toggle(id, enabled);
      if (success) {
        const server = servers.value.find((s) => s.id === id);
        if (server) {
          server.enabled = enabled;
        }
        // 清除缓存
        cache.remove('servers:list');
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '切换服务器状态失败';
      throw err;
    }
  }

  return {
    // State
    servers,
    loading,
    error,
    // Getters
    enabledServers,
    getServerById,
    // Actions
    fetchServers,
    createServer,
    updateServer,
    deleteServer,
    toggleServer,
  };
});
