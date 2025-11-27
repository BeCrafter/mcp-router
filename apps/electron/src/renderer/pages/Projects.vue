<template>
  <MainLayout>
    <div class="projects-page">
    <div class="page-header">
      <h1 class="text-2xl font-bold">项目</h1>
      <Button @click="showCreateForm = true">创建项目</Button>
    </div>

    <div v-if="projectStore.loading" class="loading">加载中...</div>
    <div v-else-if="projectStore.error" class="error">{{ projectStore.error }}</div>
    <div v-else-if="projectStore.projects.length === 0" class="empty-state">
      <p>还没有创建任何项目</p>
      <Button @click="showCreateForm = true">创建第一个项目</Button>
    </div>
    <div v-else class="project-list">
      <Card
        v-for="project in projectStore.projects"
        :key="project.id"
        class="project-card"
        :class="{ active: project.id === projectStore.currentProject?.id }"
      >
        <div class="project-header">
          <div>
            <h3 class="project-name">{{ project.name }}</h3>
            <p v-if="project.description" class="project-description">{{ project.description }}</p>
          </div>
          <div class="project-actions">
            <Button
              v-if="project.id !== projectStore.currentProject?.id"
              variant="primary"
              @click="handleSwitch(project.id)"
            >
              切换
            </Button>
            <span v-else class="current-badge">当前</span>
            <Button variant="secondary" @click="handleEdit(project)">编辑</Button>
            <Button variant="danger" @click="handleDelete(project.id)">删除</Button>
          </div>
        </div>
      </Card>
    </div>

    <!-- 创建/编辑表单 -->
    <div v-if="showCreateForm" class="modal-overlay" @click="showCreateForm = false">
      <Card class="modal-content" @click.stop>
        <h2 class="text-xl font-semibold mb-4">
          {{ editingProject ? '编辑项目' : '创建项目' }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>项目名称</label>
            <Input v-model="formData.name" placeholder="输入项目名称" required />
          </div>
          <div class="form-group">
            <label>描述（可选）</label>
            <Input v-model="formData.description" placeholder="输入项目描述" />
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
import { useProjectStore } from '../stores/project';
import MainLayout from '../components/layout/MainLayout.vue';
import type { Project } from '@mcp_router/shared/types';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Card from '../components/common/Card.vue';

const projectStore = useProjectStore();
const showCreateForm = ref(false);
const editingProject = ref<Project | null>(null);

const formData = ref({
  name: '',
  description: '',
});

const handleSwitch = (id: string) => {
  projectStore.switchProject(id);
};

const handleEdit = (project: Project) => {
  editingProject.value = project;
  formData.value = {
    name: project.name,
    description: project.description || '',
  };
  showCreateForm.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个项目吗？')) {
    await projectStore.deleteProject(id);
  }
};

const handleSubmit = async () => {
  try {
    if (editingProject.value) {
      await projectStore.updateProject(editingProject.value.id, {
        name: formData.value.name,
        description: formData.value.description || undefined,
      });
    } else {
      await projectStore.createProject({
        name: formData.value.name,
        description: formData.value.description || undefined,
      });
    }
    showCreateForm.value = false;
    editingProject.value = null;
    formData.value = { name: '', description: '' };
  } catch (error) {
    console.error('保存项目失败:', error);
  }
};

onMounted(() => {
  projectStore.fetchProjects();
});
</script>

<style scoped>
.projects-page {
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

.project-list {
  display: grid;
  gap: 16px;
}

.project-card {
  margin-bottom: 16px;
}

.project-card.active {
  border: 2px solid #2196f3;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.project-description {
  font-size: 14px;
  color: #666;
}

.project-actions {
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

