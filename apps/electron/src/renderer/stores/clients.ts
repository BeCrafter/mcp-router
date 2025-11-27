import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Client } from '@mcp_router/shared/types';

export const useClientsStore = defineStore('clients', () => {
  const api = window.platformAPI;
  
  // State
  const clients = ref<Client[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedId = ref<string | null>(null);

  // Getters
  const selectedClient = computed(() => 
    clients.value.find((c) => c.id === selectedId.value) || null
  );

  const clientsWithTokens = computed(() => 
    clients.value.filter((c) => c.token)
  );

  // Actions
  async function fetchClients() {
    loading.value = true;
    error.value = null;
    try {
      clients.value = await api.clients.list();
    } catch (err: any) {
      error.value = err.message || '获取客户端列表失败';
      console.error('Error fetching clients:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createClient(input: { name: string; type: 'predefined' | 'custom' }) {
    try {
      const client = await api.clients.create(input);
      clients.value.push(client);
      return client;
    } catch (err: any) {
      error.value = err.message || '创建客户端失败';
      throw err;
    }
  }

  async function updateClient(id: string, updates: Partial<Client>) {
    try {
      const updated = await api.clients.update(id, updates);
      if (updated) {
        const index = clients.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          clients.value[index] = updated;
        }
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || '更新客户端失败';
      throw err;
    }
  }

  async function deleteClient(id: string) {
    try {
      const success = await api.clients.delete(id);
      if (success) {
        clients.value = clients.value.filter((c) => c.id !== id);
        if (selectedId.value === id) {
          selectedId.value = null;
        }
      }
      return success;
    } catch (err: any) {
      error.value = err.message || '删除客户端失败';
      throw err;
    }
  }

  async function generateToken(id: string) {
    try {
      const client = await api.clients.generateToken(id);
      if (client) {
        const index = clients.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          clients.value[index] = client;
        }
      }
      return client;
    } catch (err: any) {
      error.value = err.message || '生成Token失败';
      throw err;
    }
  }

  async function revokeToken(id: string) {
    try {
      const client = await api.clients.revokeToken(id);
      if (client) {
        const index = clients.value.findIndex((c) => c.id === id);
        if (index !== -1) {
          clients.value[index] = client;
        }
      }
      return client;
    } catch (err: any) {
      error.value = err.message || '撤销Token失败';
      throw err;
    }
  }

  function setSelected(id: string | null) {
    selectedId.value = id;
  }

  return {
    // State
    clients,
    loading,
    error,
    selectedId,
    // Getters
    selectedClient,
    clientsWithTokens,
    // Actions
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    generateToken,
    revokeToken,
    setSelected,
  };
});

