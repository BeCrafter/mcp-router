<template>
  <MainLayout>
    <div class="workflows-page">
      <div class="page-header">
        <h1 class="text-2xl font-bold">工作流管理</h1>
        <Button @click="showAddForm = true">创建工作流</Button>
      </div>

      <div v-if="workflowsStore.loading" class="loading">
        <Loading />
      </div>
      <div v-else-if="workflowsStore.error" class="error">{{ workflowsStore.error }}</div>
      <div v-else-if="workflowsStore.workflows.length === 0" class="empty-state">
        <EmptyState message="还没有创建工作流" />
        <Button @click="showAddForm = true">创建第一个工作流</Button>
      </div>
      <div v-else class="workflows-list">
        <Card
          v-for="workflow in workflowsStore.workflows"
          :key="workflow.id"
          class="workflow-card"
        >
          <div class="workflow-header">
            <div>
              <h3 class="workflow-name">{{ workflow.name }}</h3>
              <p v-if="workflow.description" class="workflow-description">
                {{ workflow.description }}
              </p>
              <div class="workflow-meta">
                <span class="meta-item">触发: {{ getTriggerLabel(workflow.triggerType) }}</span>
                <span class="meta-item">节点数: {{ workflow.nodes.length }}</span>
                <span class="meta-item">连接数: {{ workflow.edges.length }}</span>
              </div>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="workflow.enabled"
                @change="handleToggle(workflow.id, ($event.target as HTMLInputElement).checked)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="workflow-actions">
            <Button variant="secondary" size="sm" @click="handleEdit(workflow)">编辑</Button>
            <Button variant="secondary" size="sm" @click="handleExecute(workflow.id)">执行</Button>
            <Button variant="danger" size="sm" @click="handleDelete(workflow.id)">删除</Button>
          </div>
        </Card>
      </div>

      <!-- 添加/编辑表单 -->
      <Dialog v-model="showAddForm" :title="editingWorkflow ? '编辑工作流' : '创建工作流'">
          <form @submit.prevent="handleSubmit" class="workflow-form">
            <div class="form-group">
              <label>工作流名称</label>
              <Input v-model="formData.name" placeholder="输入工作流名称" required />
            </div>
            <div class="form-group">
              <label>描述</label>
              <Input v-model="formData.description" placeholder="输入工作流描述（可选）" />
            </div>
            <div class="form-group">
              <label>触发类型</label>
              <Select
                v-model="formData.triggerType"
                :options="triggerTypeOptions"
                required
              />
            </div>
            <div class="form-actions">
              <Button type="submit">保存</Button>
              <Button variant="secondary" @click="showAddForm = false">取消</Button>
            </div>
          </form>
      </Dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorkflowsStore } from '../stores/workflows';
import MainLayout from '../components/layout/MainLayout.vue';
import Card from '../components/common/Card.vue';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Select from '../components/common/Select.vue';
import Dialog from '../components/common/Dialog.vue';
import Loading from '../components/common/Loading.vue';
import EmptyState from '../components/common/EmptyState.vue';
import type { WorkflowDefinition } from '@mcp_router/shared/types';
import { useToast } from '../composables/useToast';

const workflowsStore = useWorkflowsStore();
const toast = useToast();
const showAddForm = ref(false);
const editingWorkflow = ref<WorkflowDefinition | null>(null);

const formData = ref({
  name: '',
  description: '',
  triggerType: 'manual' as 'tools/list' | 'tools/call' | 'manual',
});

const triggerTypeOptions = [
  { value: 'tools/list', label: 'tools/list 请求时触发' },
  { value: 'tools/call', label: 'tools/call 请求时触发' },
  { value: 'manual', label: '手动触发' },
];

const getTriggerLabel = (triggerType: string) => {
  const option = triggerTypeOptions.find((opt) => opt.value === triggerType);
  return option?.label || triggerType;
};

const handleToggle = async (id: string, enabled: boolean) => {
  try {
    await workflowsStore.toggleWorkflow(id, enabled);
    toast.success(enabled ? '工作流已启用' : '工作流已禁用');
  } catch (error) {
    toast.error('切换工作流状态失败');
  }
};

const handleEdit = (workflow: WorkflowDefinition) => {
  editingWorkflow.value = workflow;
  formData.value = {
    name: workflow.name,
    description: workflow.description || '',
    triggerType: workflow.triggerType,
  };
  showAddForm.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个工作流吗？')) {
    try {
      await workflowsStore.deleteWorkflow(id);
      toast.success('工作流已删除');
    } catch (error) {
      toast.error('删除失败');
    }
  }
};

const handleExecute = async (id: string) => {
  try {
    const result = await workflowsStore.executeWorkflow(id, {});
    toast.success('工作流执行完成');
    console.log('工作流执行结果:', result);
  } catch (error) {
    toast.error('执行工作流失败');
  }
};

const handleSubmit = async () => {
  try {
    if (editingWorkflow.value) {
      await workflowsStore.updateWorkflow(editingWorkflow.value.id, {
        name: formData.value.name,
        description: formData.value.description || undefined,
        triggerType: formData.value.triggerType,
      });
      toast.success('工作流已更新');
    } else {
      await workflowsStore.createWorkflow({
        name: formData.value.name,
        description: formData.value.description || undefined,
        triggerType: formData.value.triggerType,
        nodes: [],
        edges: [],
      });
      toast.success('工作流已创建');
    }

    showAddForm.value = false;
    editingWorkflow.value = null;
    formData.value = {
      name: '',
      description: '',
      triggerType: 'manual',
    };
  } catch (error) {
    toast.error('保存失败');
  }
};

onMounted(() => {
  workflowsStore.fetchWorkflows();
});
</script>

<style scoped>
.workflows-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.workflows-list {
  display: grid;
  gap: 16px;
}

.workflow-card {
  padding: 16px;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.workflow-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.workflow-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.workflow-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}

.meta-item {
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #2196f3;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.workflow-actions {
  display: flex;
  gap: 8px;
}

.workflow-form {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 48px;
}
</style>

