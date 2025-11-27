<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-icon">
      <component :is="icon" />
    </div>
    <h3 v-if="title" class="empty-title">{{ title }}</h3>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <div v-if="$slots.actions" class="empty-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  icon?: string;
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  min-height: 300px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  color: var(--text-secondary, #999);
  opacity: 0.5;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary, #333);
}

.empty-description {
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin: 0 0 24px 0;
  max-width: 400px;
}

.empty-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 深色主题 */
.dark .empty-icon {
  color: var(--text-secondary-dark, #666);
}

.dark .empty-title {
  color: var(--text-primary-dark, #fff);
}

.dark .empty-description {
  color: var(--text-secondary-dark, #aaa);
}
</style>

