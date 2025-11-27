<template>
  <div class="main-layout">
    <Sidebar />
    <div class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <Header :title="pageTitle" />
      <main class="content-area">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

const route = useRoute();
const isSidebarCollapsed = ref(false);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/servers': '服务器管理',
    '/projects': '项目管理',
    '/workspaces': '工作区管理',
    '/settings': '设置',
  };
  return titles[route.path] || 'MCP Router';
});

onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed');
  if (saved !== null) {
    isSidebarCollapsed.value = saved === 'true';
  }
  
  // 监听localStorage变化（跨组件同步）
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'sidebar-collapsed') {
      isSidebarCollapsed.value = e.newValue === 'true';
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
  });
});
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-content {
  flex: 1;
  margin-left: 240px;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
  overflow: hidden;
}

.main-content.sidebar-collapsed {
  margin-left: 64px;
}

.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: var(--bg-primary, #fff);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}

/* 深色主题 */
.dark .content-area {
  background: var(--bg-primary-dark, #121212);
}
</style>

