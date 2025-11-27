<template>
  <MainLayout>
    <div class="servers-page">
      <div class="page-header">
        <h1 class="text-2xl font-bold">MCP服务器</h1>
        <Button @click="showAddForm = true">添加服务器</Button>
      </div>

      <div v-if="serversStore.loading" class="loading">加载中...</div>
      <div v-else-if="serversStore.error" class="error">{{ serversStore.error }}</div>
      <div v-else-if="serversStore.servers.length === 0" class="empty-state">
        <p>还没有添加任何服务器</p>
        <Button @click="showAddForm = true">添加第一个服务器</Button>
      </div>
      <div v-else class="server-list">
        <Card 
          v-for="server in serversStore.servers" 
          :key="server.id" 
          v-memo="[server.id, server.enabled]"
          class="server-card"
        >
          <div class="server-header">
            <div>
              <h3 class="server-name">{{ server.name }}</h3>
              <p class="server-transport">{{ server.transport }}</p>
            </div>
            <label class="toggle-switch">
              <input
                type="checkbox"
                :checked="server.enabled"
                @change="handleToggle(server.id, ($event.target as HTMLInputElement).checked)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="server-actions">
            <Button variant="secondary" @click="handleEdit(server)">编辑</Button>
            <Button variant="danger" @click="handleDelete(server.id)">删除</Button>
          </div>
        </Card>
      </div>

      <!-- 添加/编辑表单 -->
      <div v-if="showAddForm" class="modal-overlay" @click="showAddForm = false">
        <Card class="modal-content" @click.stop>
          <h2 class="text-xl font-semibold mb-4">
            {{ editingServer ? '编辑服务器' : '添加服务器' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>服务器名称</label>
              <Input v-model="formData.name" placeholder="输入服务器名称" required />
            </div>
            <div class="form-group">
              <label>传输类型</label>
              <Select
                v-model="formData.transport"
                :options="transportOptions"
                required
              />
            </div>
            <div class="form-group">
              <label>命令（stdio传输）</label>
              <Input v-model="formData.command" placeholder="例如: node" />
            </div>
            <div class="form-actions">
              <Button type="submit">保存</Button>
              <Button variant="secondary" @click="showAddForm = false">取消</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useServersStore } from '../stores/servers';
import MainLayout from '../components/layout/MainLayout.vue';
import type { Server } from '@mcp_router/shared/types';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Select from '../components/common/Select.vue';
import Card from '../components/common/Card.vue';

const serversStore = useServersStore();
const showAddForm = ref(false);
const editingServer = ref<Server | null>(null);

const formData = ref({
  name: '',
  transport: 'stdio' as 'stdio' | 'http' | 'sse',
  command: '',
  args: [] as string[],
});

const transportOptions = [
  { value: 'stdio', label: 'Stdio' },
  { value: 'http', label: 'HTTP' },
  { value: 'sse', label: 'SSE' },
];

const handleToggle = async (id: string, enabled: boolean) => {
  await serversStore.toggleServer(id, enabled);
};

const handleEdit = (server: Server) => {
  editingServer.value = server;
  formData.value = {
    name: server.name,
    transport: server.transport,
    command: server.config.command || '',
    args: server.config.args || [],
  };
  showAddForm.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个服务器吗？')) {
    await serversStore.deleteServer(id);
  }
};

const handleSubmit = async () => {
  try {
    const config: Server['config'] = {
      command: formData.value.command,
      args: formData.value.args,
    };

    if (editingServer.value) {
      await serversStore.updateServer(editingServer.value.id, {
        name: formData.value.name,
        transport: formData.value.transport,
        config,
      });
    } else {
      await serversStore.createServer({
        name: formData.value.name,
        transport: formData.value.transport,
        config,
      });
    }

    showAddForm.value = false;
    editingServer.value = null;
    formData.value = {
      name: '',
      transport: 'stdio',
      command: '',
      args: [],
    };
  } catch (error) {
    console.error('保存服务器失败:', error);
  }
};

onMounted(() => {
  serversStore.fetchServers();
});
</script>

<style scoped>
.servers-page {
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

.server-list {
  display: grid;
  gap: 16px;
}

.server-card {
  margin-bottom: 16px;
}

.server-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.server-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.server-transport {
  font-size: 14px;
  color: #666;
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

.server-actions {
  display: flex;
  gap: 8px;
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

