import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { WorkflowDefinition } from '@mcp_router/shared/types';

export const useWorkflowsStore = defineStore('workflows', () => {
  const api = window.platformAPI;
  
  // State
  const workflows = ref<WorkflowDefinition[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedId = ref<string | null>(null);

  // Getters
  const selectedWorkflow = computed(() => 
    workflows.value.find((w) => w.id === selectedId.value) || null
  );

  const enabledWorkflows = computed(() => 
    workflows.value.filter((w) => w.enabled)
  );

  // Actions
  async function fetchWorkflows() {
    loading.value = true;
    error.value = null;
    try {
      workflows.value = await api.workflows.list();
    } catch (err: any) {
      error.value = err.message || '获取工作流列表失败';
      console.error('Error fetching workflows:', err);
    } finally {
      loading.value = false;
    }
  }

  async function getWorkflow(id: string) {
    try {
      const workflow = await api.workflows.get(id);
      const index = workflows.value.findIndex((w) => w.id === id);
      if (index !== -1) {
        workflows.value[index] = workflow;
      } else {
        workflows.value.push(workflow);
      }
      return workflow;
    } catch (err: any) {
      error.value = err.message || '获取工作流失败';
      throw err;
    }
  }

  async function createWorkflow(input: {
    name: string;
    description?: string;
    triggerType: 'tools/list' | 'tools/call' | 'manual';
    nodes?: any[];
    edges?: any[];
  }) {
    try {
      const workflow = await api.workflows.create(input);
      workflows.value.push(workflow);
      return workflow;
    } catch (err: any) {
      error.value = err.message || '创建工作流失败';
      throw err;
    }
  }

  async function updateWorkflow(id: string, updates: Partial<WorkflowDefinition>) {
    try {
      const updated = await api.workflows.update(id, updates);
      if (updated) {
        const index = workflows.value.findIndex((w) => w.id === id);
        if (index !== -1) {
          workflows.value[index] = updated;
        }
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || '更新工作流失败';
      throw err;
    }
  }

  async function deleteWorkflow(id: string) {
    try {
      const success = await api.workflows.delete(id);
      if (success) {
        workflows.value = workflows.value.filter((w) => w.id !== id);
        if (selectedId.value === id) {
          selectedId.value = null;
        }
      }
      return success;
    } catch (err: any) {
      error.value = err.message || '删除工作流失败';
      throw err;
    }
  }

  async function toggleWorkflow(id: string, enabled: boolean) {
    try {
      const updated = await api.workflows.toggle(id, enabled);
      if (updated) {
        const index = workflows.value.findIndex((w) => w.id === id);
        if (index !== -1) {
          workflows.value[index] = updated;
        }
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || '切换工作流状态失败';
      throw err;
    }
  }

  async function executeWorkflow(id: string, context?: Record<string, unknown>) {
    try {
      return await api.workflows.execute(id, context);
    } catch (err: any) {
      error.value = err.message || '执行工作流失败';
      throw err;
    }
  }

  function setSelected(id: string | null) {
    selectedId.value = id;
  }

  return {
    // State
    workflows,
    loading,
    error,
    selectedId,
    // Getters
    selectedWorkflow,
    enabledWorkflows,
    // Actions
    fetchWorkflows,
    getWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    toggleWorkflow,
    executeWorkflow,
    setSelected,
  };
});

