<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="toast"
        :class="[type, position]"
        role="alert"
        :aria-live="type === 'error' ? 'assertive' : 'polite'"
      >
        <div class="toast-icon">
          <component :is="iconComponent" />
        </div>
        <div class="toast-content">
          <div v-if="title" class="toast-title">{{ title }}</div>
          <div class="toast-message">{{ message }}</div>
        </div>
        <button
          v-if="closable"
          class="toast-close"
          @click="handleClose"
          aria-label="关闭提示"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    duration?: number;
    closable?: boolean;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  }>(),
  {
    type: 'info',
    duration: 3000,
    closable: true,
    position: 'top-right',
  }
);

const emit = defineEmits<{
  close: [];
}>();

const visible = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const iconComponent = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };
  return icons[props.type] || 'ℹ';
});

const handleClose = () => {
  visible.value = false;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  emit('close');
};

onMounted(() => {
  visible.value = true;
  if (props.duration > 0) {
    timer = setTimeout(() => {
      handleClose();
    }, props.duration);
  }
});

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.toast {
  position: fixed;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--bg-primary, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 300px;
  max-width: 500px;
}

.toast.top-right {
  top: 24px;
  right: 24px;
}

.toast.top-left {
  top: 24px;
  left: 24px;
}

.toast.bottom-right {
  bottom: 24px;
  right: 24px;
}

.toast.bottom-left {
  bottom: 24px;
  left: 24px;
}

.toast-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.toast.success .toast-icon {
  color: #4caf50;
}

.toast.error .toast-icon {
  color: #f44336;
}

.toast.warning .toast-icon {
  color: #ff9800;
}

.toast.info .toast-icon {
  color: #2196f3;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--text-primary, #333);
}

.toast-message {
  color: var(--text-secondary, #666);
  font-size: 14px;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--text-secondary, #666);
  transition: color 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--text-primary, #333);
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 深色主题 */
.dark .toast {
  background: var(--bg-primary-dark, #1e1e1e);
}

.dark .toast-title {
  color: var(--text-primary-dark, #fff);
}

.dark .toast-message {
  color: var(--text-secondary-dark, #aaa);
}

.dark .toast-close {
  color: var(--text-secondary-dark, #aaa);
}

.dark .toast-close:hover {
  color: var(--text-primary-dark, #fff);
}
</style>

