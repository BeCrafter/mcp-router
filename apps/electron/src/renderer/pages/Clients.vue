<template>
  <MainLayout>
    <div class="clients-page">
      <div class="page-header">
        <h1 class="text-2xl font-bold">客户端管理</h1>
        <Button @click="showAddForm = true">添加客户端</Button>
      </div>

      <div v-if="clientsStore.loading" class="loading">
        <Loading />
      </div>
      <div v-else-if="clientsStore.error" class="error">{{ clientsStore.error }}</div>
      <div v-else-if="clientsStore.clients.length === 0" class="empty-state">
        <EmptyState message="还没有添加任何客户端" />
        <Button @click="showAddForm = true">添加第一个客户端</Button>
      </div>
      <div v-else class="clients-list">
        <Card v-for="client in clientsStore.clients" :key="client.id" class="client-card">
          <div class="client-header">
            <div>
              <h3 class="client-name">{{ client.name }}</h3>
              <p class="client-type">{{ client.type === 'predefined' ? '预定义' : '自定义' }}</p>
            </div>
          </div>

          <div v-if="client.token" class="client-token">
            <div class="token-label">Token:</div>
            <div class="token-value">
              <code>{{ maskToken(client.token) }}</code>
              <Button
                variant="secondary"
                size="sm"
                @click="copyToken(client.token!)"
              >
                复制
              </Button>
            </div>
          </div>
          <div v-else class="no-token">
            <span>未生成Token</span>
            <Button size="sm" @click="handleGenerateToken(client.id)">生成Token</Button>
          </div>

          <div class="client-info">
            <div class="info-item">
              <span class="info-label">创建时间:</span>
              <span class="info-value">{{ formatTime(client.createdAt) }}</span>
            </div>
            <div v-if="client.lastConnectedAt" class="info-item">
              <span class="info-label">最后连接:</span>
              <span class="info-value">{{ formatTime(client.lastConnectedAt * 1000) }}</span>
            </div>
          </div>

          <div class="client-actions">
            <Button
              v-if="client.token"
              variant="secondary"
              size="sm"
              @click="handleRevokeToken(client.id)"
            >
              撤销Token
            </Button>
            <Button variant="secondary" size="sm" @click="handleEdit(client)">编辑</Button>
            <Button variant="danger" size="sm" @click="handleDelete(client.id)">删除</Button>
          </div>
        </Card>
      </div>

      <!-- 添加/编辑表单 -->
      <Dialog v-model="showAddForm" :title="editingClient ? '编辑客户端' : '添加客户端'">
          <form @submit.prevent="handleSubmit" class="client-form">
            <div class="form-group">
              <label>客户端名称</label>
              <Input v-model="formData.name" placeholder="输入客户端名称" required />
            </div>
            <div class="form-group">
              <label>类型</label>
              <Select
                v-model="formData.type"
                :options="typeOptions"
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
import { useClientsStore } from '../stores/clients';
import MainLayout from '../components/layout/MainLayout.vue';
import Card from '../components/common/Card.vue';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Select from '../components/common/Select.vue';
import Dialog from '../components/common/Dialog.vue';
import Loading from '../components/common/Loading.vue';
import EmptyState from '../components/common/EmptyState.vue';
import type { Client } from '@mcp_router/shared/types';
import { useToast } from '../composables/useToast';

const clientsStore = useClientsStore();
const toast = useToast();
const showAddForm = ref(false);
const editingClient = ref<Client | null>(null);

const formData = ref({
  name: '',
  type: 'custom' as 'predefined' | 'custom',
});

const typeOptions = [
  { value: 'predefined', label: '预定义' },
  { value: 'custom', label: '自定义' },
];

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString('zh-CN');
};

const maskToken = (token: string) => {
  if (token.length <= 8) return token;
  return token.substring(0, 8) + '...' + token.substring(token.length - 4);
};

const copyToken = async (token: string) => {
  try {
    await navigator.clipboard.writeText(token);
    toast.success('Token已复制到剪贴板');
  } catch (error) {
    toast.error('复制失败');
  }
};

const handleGenerateToken = async (id: string) => {
  try {
    const client = await clientsStore.generateToken(id);
    if (client?.token) {
      toast.success('Token生成成功');
      await copyToken(client.token);
    }
  } catch (error) {
    toast.error('生成Token失败');
  }
};

const handleRevokeToken = async (id: string) => {
  if (confirm('确定要撤销Token吗？客户端将无法继续连接。')) {
    try {
      await clientsStore.revokeToken(id);
      toast.success('Token已撤销');
    } catch (error) {
      toast.error('撤销Token失败');
    }
  }
};

const handleEdit = (client: Client) => {
  editingClient.value = client;
  formData.value = {
    name: client.name,
    type: client.type,
  };
  showAddForm.value = true;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个客户端吗？')) {
    try {
      await clientsStore.deleteClient(id);
      toast.success('客户端已删除');
    } catch (error) {
      toast.error('删除失败');
    }
  }
};

const handleSubmit = async () => {
  try {
    if (editingClient.value) {
      await clientsStore.updateClient(editingClient.value.id, {
        name: formData.value.name,
        type: formData.value.type,
      });
      toast.success('客户端已更新');
    } else {
      await clientsStore.createClient({
        name: formData.value.name,
        type: formData.value.type,
      });
      toast.success('客户端已创建');
    }

    showAddForm.value = false;
    editingClient.value = null;
    formData.value = {
      name: '',
      type: 'custom',
    };
  } catch (error) {
    toast.error('保存失败');
  }
};

onMounted(() => {
  clientsStore.fetchClients();
});
</script>

<style scoped>
.clients-page {
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

.clients-list {
  display: grid;
  gap: 16px;
}

.client-card {
  padding: 16px;
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.client-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.client-type {
  font-size: 14px;
  color: #666;
}

.client-token {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.token-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.token-value {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-value code {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
  background: white;
  padding: 8px;
  border-radius: 4px;
}

.no-token {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #fff3cd;
  border-radius: 4px;
  color: #856404;
}

.client-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #333;
}

.client-actions {
  display: flex;
  gap: 8px;
}

.client-form {
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

