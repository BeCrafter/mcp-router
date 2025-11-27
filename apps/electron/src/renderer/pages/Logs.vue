<template>
  <MainLayout>
    <div class="logs-page">
      <div class="page-header">
        <h1 class="text-2xl font-bold">请求日志</h1>
        <div class="header-actions">
          <Button variant="secondary" @click="handleCleanup">清理旧日志</Button>
          <Button @click="handleRefresh">刷新</Button>
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-if="logsStore.statistics.total > 0" class="stats-grid">
        <Card class="stat-card">
          <div class="stat-value">{{ logsStore.statistics.total }}</div>
          <div class="stat-label">总请求数</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-value">{{ logsStore.statistics.successRate.toFixed(1) }}%</div>
          <div class="stat-label">成功率</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-value">{{ logsStore.statistics.avgDuration }}ms</div>
          <div class="stat-label">平均响应时间</div>
        </Card>
        <Card class="stat-card">
          <div class="stat-value">{{ logsStore.statistics.errors }}</div>
          <div class="stat-label">错误数</div>
        </Card>
      </div>

      <!-- 过滤器 -->
      <Card class="filters-card">
        <div class="filters">
          <div class="filter-group">
            <label>日期</label>
            <Input
              type="date"
              :modelValue="selectedDate"
              @update:modelValue="handleDateChange"
            />
          </div>
          <div class="filter-group">
            <label>请求类型</label>
            <Select
              v-model="filters.requestType"
              :options="requestTypeOptions"
              placeholder="全部"
              @change="handleFilterChange"
            />
          </div>
          <div class="filter-group">
            <label>状态</label>
            <Select
              v-model="filters.status"
              :options="statusOptions"
              placeholder="全部"
              @change="handleFilterChange"
            />
          </div>
          <div class="filter-group">
            <Button variant="secondary" @click="handleClearFilters">清除筛选</Button>
          </div>
        </div>
      </Card>

      <!-- 日志列表 -->
      <div v-if="logsStore.loading" class="loading">
        <Loading />
      </div>
      <div v-else-if="logsStore.error" class="error">
        {{ logsStore.error }}
      </div>
      <div v-else-if="logsStore.filteredLogs.length === 0" class="empty-state">
        <EmptyState message="没有找到日志记录" />
      </div>
      <div v-else class="logs-list">
        <Card
          v-for="log in logsStore.filteredLogs"
          :key="log.id"
          class="log-item"
          :class="{ 'log-error': log.status === 'error' }"
        >
          <div class="log-header">
            <div class="log-info">
              <span class="log-method">{{ log.requestType }}</span>
              <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              <span class="log-duration" v-if="log.duration">{{ log.duration }}ms</span>
            </div>
            <span
              class="log-status"
              :class="log.status === 'success' ? 'status-success' : 'status-error'"
            >
              {{ log.status === 'success' ? '成功' : '失败' }}
            </span>
          </div>
          <div v-if="log.error" class="log-error-message">
            {{ log.error }}
          </div>
          <div class="log-details" v-if="expandedLogs.has(log.id)">
            <div class="detail-section">
              <strong>参数:</strong>
              <pre>{{ JSON.stringify(log.params, null, 2) }}</pre>
            </div>
            <div class="detail-section" v-if="log.response">
              <strong>响应:</strong>
              <pre>{{ JSON.stringify(log.response, null, 2) }}</pre>
            </div>
          </div>
          <div class="log-actions">
            <Button
              variant="secondary"
              size="sm"
              @click="toggleExpand(log.id)"
            >
              {{ expandedLogs.has(log.id) ? '收起' : '展开' }}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLogsStore } from '../stores/logs';
import MainLayout from '../components/layout/MainLayout.vue';
import Card from '../components/common/Card.vue';
import Button from '../components/common/Button.vue';
import Input from '../components/common/Input.vue';
import Select from '../components/common/Select.vue';
import Loading from '../components/common/Loading.vue';
import EmptyState from '../components/common/EmptyState.vue';
import { useToast } from '../composables/useToast';

const logsStore = useLogsStore();
const toast = useToast();
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const expandedLogs = ref(new Set<string>());
const filters = ref<{
  requestType?: string;
  status?: 'success' | 'error';
}>({});

const requestTypeOptions = [
  { value: '', label: '全部' },
  { value: 'tools/list', label: 'tools/list' },
  { value: 'tools/call', label: 'tools/call' },
  { value: 'resources/list', label: 'resources/list' },
  { value: 'resources/read', label: 'resources/read' },
  { value: 'prompts/list', label: 'prompts/list' },
  { value: 'prompts/get', label: 'prompts/get' },
];

const statusOptions = [
  { value: '', label: '全部' },
  { value: 'success', label: '成功' },
  { value: 'error', label: '失败' },
];

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('zh-CN');
};

const handleDateChange = async (date: string) => {
  selectedDate.value = date;
  await logsStore.readLogsByDate(date);
};

const handleFilterChange = () => {
  logsStore.setFilters(filters.value);
};

const handleClearFilters = () => {
  filters.value = {};
  logsStore.clearFilters();
};

const handleRefresh = async () => {
  await logsStore.fetchLogs({
    startDate: selectedDate.value,
    endDate: selectedDate.value,
    ...filters.value,
  });
};

const handleCleanup = async () => {
  if (confirm('确定要清理超过3天的旧日志吗？')) {
    await logsStore.cleanupLogs();
    toast.success('日志清理完成');
    await handleRefresh();
  }
};

const toggleExpand = (logId: string) => {
  if (expandedLogs.value.has(logId)) {
    expandedLogs.value.delete(logId);
  } else {
    expandedLogs.value.add(logId);
  }
};

onMounted(async () => {
  await logsStore.readLogsByDate(selectedDate.value);
});
</script>

<style scoped>
.logs-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  padding: 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.filters-card {
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  padding: 16px;
}

.log-item.log-error {
  border-left: 4px solid #f44336;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.log-info {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.log-method {
  font-weight: 600;
  color: #2196f3;
}

.log-time {
  color: #666;
  font-size: 14px;
}

.log-duration {
  color: #666;
  font-size: 14px;
}

.log-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-error {
  background: #ffebee;
  color: #c62828;
}

.log-error-message {
  color: #c62828;
  font-size: 14px;
  margin-bottom: 8px;
  padding: 8px;
  background: #ffebee;
  border-radius: 4px;
}

.log-details {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
}

.detail-section {
  margin-bottom: 12px;
}

.detail-section strong {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.detail-section pre {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.log-actions {
  margin-top: 8px;
}

.loading,
.error {
  text-align: center;
  padding: 48px;
}

.empty-state {
  padding: 48px;
}
</style>

