<template>
  <div class="loading" :class="{ overlay, size }" role="status" aria-label="加载中">
    <div class="loading-spinner">
      <svg
        class="spinner"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="spinner-path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
      </svg>
    </div>
    <div v-if="text" class="loading-text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
    overlay?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  {
    overlay: false,
    size: 'md',
  }
);
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
}

.loading.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loading.sm .spinner {
  width: 24px;
  height: 24px;
}

.loading.md .spinner {
  width: 40px;
  height: 40px;
}

.loading.lg .spinner {
  width: 64px;
  height: 64px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  animation: spin 1s linear infinite;
  color: var(--primary-color, #2196f3);
}

.spinner-path {
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-text {
  color: var(--text-secondary, #666);
  font-size: 14px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 深色主题 */
.dark .loading.overlay {
  background: rgba(0, 0, 0, 0.9);
}

.dark .loading-text {
  color: var(--text-secondary-dark, #aaa);
}
</style>

