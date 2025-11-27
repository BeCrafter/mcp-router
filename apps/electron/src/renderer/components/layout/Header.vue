<template>
  <header class="header">
    <div class="header-left">
      <h1 class="header-title">{{ title }}</h1>
    </div>
    <div class="header-right">
      <slot name="actions">
        <!-- 默认操作按钮 -->
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped>
.header {
  height: 64px;
  padding: 0 24px;
  background: var(--bg-primary, #fff);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  flex: 1;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #333);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 深色主题 */
.dark .header {
  background: var(--bg-primary-dark, #121212);
  border-bottom-color: var(--border-color-dark, #333);
}

.dark .header-title {
  color: var(--text-primary-dark, #fff);
}
</style>

