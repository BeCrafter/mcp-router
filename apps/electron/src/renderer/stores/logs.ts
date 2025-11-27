import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { LogEntry } from '@mcp_router/shared/types';

export const useLogsStore = defineStore('logs', () => {
  const api = window.platformAPI;
  
  // State
  const logs = ref<LogEntry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedDate = ref<string>(new Date().toISOString().split('T')[0]);
  const filters = ref<{
    serverId?: string;
    requestType?: string;
    status?: 'success' | 'error';
    startDate?: string;
    endDate?: string;
  }>({});

  // Getters
  const filteredLogs = computed(() => {
    let result = logs.value;
    
    if (filters.value.serverId) {
      result = result.filter((log) => log.serverId === filters.value.serverId);
    }
    if (filters.value.requestType) {
      result = result.filter((log) => log.requestType === filters.value.requestType);
    }
    if (filters.value.status) {
      result = result.filter((log) => log.status === filters.value.status);
    }
    
    return result.sort((a, b) => b.timestamp - a.timestamp);
  });

  const statistics = computed(() => {
    const total = logs.value.length;
    const success = logs.value.filter((log) => log.status === 'success').length;
    const errors = logs.value.filter((log) => log.status === 'error').length;
    const avgDuration = logs.value.length > 0
      ? logs.value.reduce((sum, log) => sum + (log.duration || 0), 0) / logs.value.length
      : 0;

    return {
      total,
      success,
      errors,
      successRate: total > 0 ? (success / total) * 100 : 0,
      avgDuration: Math.round(avgDuration),
    };
  });

  // Actions
  async function fetchLogs(options?: {
    startDate?: string;
    endDate?: string;
    serverId?: string;
    requestType?: string;
    status?: 'success' | 'error';
  }) {
    loading.value = true;
    error.value = null;
    try {
      logs.value = await api.logs.query(options || {});
    } catch (err: any) {
      error.value = err.message || '获取日志失败';
      console.error('Error fetching logs:', err);
    } finally {
      loading.value = false;
    }
  }

  async function readLogsByDate(date: string) {
    loading.value = true;
    error.value = null;
    try {
      logs.value = await api.logs.read({ date });
      selectedDate.value = date;
    } catch (err: any) {
      error.value = err.message || '读取日志失败';
      console.error('Error reading logs:', err);
    } finally {
      loading.value = false;
    }
  }

  async function cleanupLogs() {
    try {
      await api.logs.cleanup();
      // 重新获取日志
      await fetchLogs();
    } catch (err: any) {
      error.value = err.message || '清理日志失败';
      console.error('Error cleaning up logs:', err);
    }
  }

  function setFilters(newFilters: typeof filters.value) {
    filters.value = { ...filters.value, ...newFilters };
  }

  function clearFilters() {
    filters.value = {};
  }

  return {
    // State
    logs,
    loading,
    error,
    selectedDate,
    filters,
    // Getters
    filteredLogs,
    statistics,
    // Actions
    fetchLogs,
    readLogsByDate,
    cleanupLogs,
    setFilters,
    clearFilters,
  };
});

