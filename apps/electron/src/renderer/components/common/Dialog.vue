<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="modelValue"
        class="dialog-overlay"
        @click.self="handleClose"
        role="dialog"
        :aria-modal="true"
        :aria-labelledby="titleId"
      >
        <div class="dialog-container" :class="size">
          <div class="dialog-header">
            <h2 :id="titleId" class="dialog-title">{{ title }}</h2>
            <button
              class="dialog-close"
              @click="handleClose"
              aria-label="关闭对话框"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="dialog-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const titleId = computed(() => `dialog-title-${Math.random().toString(36).substr(2, 9)}`);

const handleClose = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.dialog-overlay {
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
  padding: 16px;
}

.dialog-container {
  background: var(--bg-primary, #fff);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog-container.sm {
  width: 400px;
}

.dialog-container.md {
  width: 600px;
}

.dialog-container.lg {
  width: 800px;
}

.dialog-container.xl {
  width: 1200px;
}

.dialog-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary, #333);
}

.dialog-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary, #666);
  transition: color 0.2s;
}

.dialog-close:hover {
  color: var(--text-primary, #333);
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 过渡动画 */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s;
}

.dialog-enter-active .dialog-container,
.dialog-leave-active .dialog-container {
  transition: transform 0.3s, opacity 0.3s;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from .dialog-container,
.dialog-leave-to .dialog-container {
  transform: scale(0.95);
  opacity: 0;
}

/* 深色主题 */
.dark .dialog-container {
  background: var(--bg-primary-dark, #1e1e1e);
}

.dark .dialog-header {
  border-bottom-color: var(--border-color-dark, #333);
}

.dark .dialog-title {
  color: var(--text-primary-dark, #fff);
}

.dark .dialog-close {
  color: var(--text-secondary-dark, #aaa);
}

.dark .dialog-close:hover {
  color: var(--text-primary-dark, #fff);
}

.dark .dialog-footer {
  border-top-color: var(--border-color-dark, #333);
}
</style>

