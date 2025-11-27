<template>
  <div class="toast-container">
    <TransitionGroup name="toast-list">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.options.message"
        :type="toast.options.type"
        :title="toast.options.title"
        :duration="toast.options.duration"
        :closable="toast.options.closable"
        :position="toast.options.position"
        @close="handleClose(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast';
import Toast from './common/Toast.vue';

const { toasts, remove } = useToast();

const handleClose = (id: number) => {
  remove(id);
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 2000;
  pointer-events: none;
}

.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

