<template>
  <MainLayout>
    <div class="workspaces-page">
    <div class="page-header">
      <h1 class="text-2xl font-bold">工作区</h1>
      <Button @click="showCreateForm = true">创建工作区</Button>
    </div>

    <div v-if="workspaceStore.loading" class="loading">加载中...</div>
    <div v-else-if="workspaceStore.error" class="error">{{ workspaceStore.error }}</div>
    <div v-else-if="workspaceStore.workspaces.length === 0" class="empty-state">
      <p>还没有创建工作区</p>
      <Button @click="showCreateForm = true">创建第一个工作区</Button>
    </div>
    <div v-else class="workspace-list">
      <Card
        v-for="workspace in workspaceStore.workspaces"
        :key="workspace.id"
        class="workspace-card"
        :class="{ active: workspace.id === workspaceStore.currentWorkspace?.id }"
      >
        <div class="workspace-header">
          <div>
            <h3 class="workspace-name">{{ workspace.name }}</h3>
            <p class="workspace-type">{{ workspace.type === 'local' ? '本地' : '远程' }}</p>
            <p v-if="workspace.lastUsedAt" class="workspace-last-used">
              最后使用: {{ formatDate(workspace.lastUsedAt) }}
            </p>
          </div>
          <div class="workspace-actions">
            <Button
              v-if="workspace.id !== workspaceStore.currentWorkspace?.id"
              variant="primary"
              @click="handleSwitch(workspace.id)"
            >
              切换
            </Button>
            <span v-else class="current-badge">当前</span>
            <Button variant="secondary" @click="handleEdit(workspace)">编辑</Button>
            <Button
              v-if="workspaceStore.workspaces.length > 1"
              variant="danger"
              @click="handleDelete(workspace.id)"
            >
              删除
            </Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- 创建/编辑表单 -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <Card class="modal-content" @click.stop>
        <h2 class="text-xl font-semibold mb-4">
          {{ editingWorkspace ? '编辑工作区' : '创建工作区' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>工作区名称</label>
            <Input v-model="formData.name" placeholder="输入工作区名称" required />
          </div>
          <div class="form-actions">
            <Button type="submit">保存</Button>
            <Button variant="secondary" @click="showCreateForm = false">取消</Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorkspaceStore } from '../stores/workspace';
import MainLayout from '../components/layout/MainLayout.vue';
import type { Workspace } from '@mcp_router/shared/types';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Card from '../components/common/Card.vue';

const workspaceStore = useWorkspaceStore();
const showCreateForm = ref(false);
const editingWorkspace = ref<Workspace | null>(null);

const formData = ref({
  name: '',
});

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-CN');
};

const handleSwitch = async (id: string) => {
  await workspaceStore.switchWorkspace(id);
  // 刷新页面数据
  window.location.reload();
};

const handleEdit = (workspace: Workspace) => {
  editingWorkspace.value = workspace;
  formData.value = { name: workspace.name };
  showCreateForm.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个工作区吗？删除后数据将无法恢复。')) {
    await workspaceStore.deleteWorkspace(id);
  }
};

const handleSubmit = async () => {
  try {
    if (editingWorkspace.value) {
      await workspaceStore.updateWorkspace(editingWorkspace.value.id, {
        name: formData.value.name,
      });
    } else {
      await workspaceStore.createWorkspace(formData.value.name);
    }
    showCreateForm.value = false;
    editingWorkspace.value = null;
    formData.value = { name: '' };
  } catch (error) {
    console.error('保存工作区失败:', error);
  }
};

onMounted(() => {
  workspaceStore.fetchWorkspaces();
});
</script>

<style scoped>
.workspaces-page {
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

.workspace-list {
  display: grid;
  gap: 16px;
}

.workspace-card {
  margin-bottom: 16px;
}

.workspace-card.active {
  border: 2px solid #2196f3;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workspace-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.workspace-type {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.workspace-last-used {
  font-size: 12px;
  color: #999;
}

.workspace-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.current-badge {
  padding: 4px 12px;
  background: #4caf50;
  color: white;
  border-radius: 4px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  min-width: 400px;
  max-width: 600px;
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
  color: #666;
}
</style>

