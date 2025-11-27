<template>
  <aside
    class="sidebar"
    :class="{ collapsed: isCollapsed }"
    :aria-label="'侧边栏导航'"
  >
    <div class="sidebar-header">
      <h2 class="sidebar-title">MCP Router</h2>
      <button
        class="sidebar-toggle"
        @click="toggleCollapse"
        :aria-label="isCollapsed ? '展开侧边栏' : '折叠侧边栏'"
      >
        <svg
          v-if="!isCollapsed"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: $route.path === item.path }"
      >
        <component :is="item.icon" class="nav-icon" />
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isCollapsed = ref(false);

const navItems = [
  {
    path: '/servers',
    label: '服务器',
    icon: 'div', // 简化：实际应使用图标组件
  },
  {
    path: '/projects',
    label: '项目',
    icon: 'div',
  },
  {
    path: '/workspaces',
    label: '工作区',
    icon: 'div',
  },
  {
    path: '/workflows',
    label: '工作流',
    icon: 'div',
  },
  {
    path: '/logs',
    label: '日志',
    icon: 'div',
  },
  {
    path: '/clients',
    label: '客户端',
    icon: 'div',
  },
  {
    path: '/settings',
    label: '设置',
    icon: 'div',
  },
];

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

onMounted(() => {
  // 从localStorage恢复折叠状态
  const saved = localStorage.getItem('sidebar-collapsed');
  if (saved !== null) {
    isCollapsed.value = saved === 'true';
  }
});

// 监听折叠状态变化，保存到localStorage
import { watch } from 'vue';
watch(isCollapsed, (newVal) => {
  localStorage.setItem('sidebar-collapsed', String(newVal));
});
</script>

<style scoped>
.sidebar {
  width: 240px;
  height: 100vh;
  background: var(--bg-secondary, #f5f5f5);
  border-right: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .sidebar-title {
  display: none;
}

.sidebar-toggle {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary, #666);
  transition: color 0.2s;
}

.sidebar-toggle:hover {
  color: var(--text-primary, #333);
}

.sidebar-nav {
  flex: 1;
  padding: 8px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 4px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-secondary, #666);
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background: var(--bg-hover, #e8e8e8);
  color: var(--text-primary, #333);
}

.nav-item.active {
  background: var(--bg-active, #e3f2fd);
  color: var(--primary-color, #2196f3);
  font-weight: 500;
}

.nav-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar.collapsed .nav-label {
  display: none;
}

/* 深色主题 */
.dark .sidebar {
  background: var(--bg-secondary-dark, #1e1e1e);
  border-right-color: var(--border-color-dark, #333);
}

.dark .sidebar-header {
  border-bottom-color: var(--border-color-dark, #333);
}

.dark .nav-item {
  color: var(--text-secondary-dark, #aaa);
}

.dark .nav-item:hover {
  background: var(--bg-hover-dark, #2a2a2a);
  color: var(--text-primary-dark, #fff);
}

.dark .nav-item.active {
  background: var(--bg-active-dark, #1e3a5f);
  color: var(--primary-color-dark, #64b5f6);
}
</style>

