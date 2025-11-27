<template>
  <div class="app">
    <RouterView />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useTheme } from './composables/useTheme';
import ToastContainer from './components/ToastContainer.vue';

// 初始化主题
useTheme();
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg-primary, #f5f5f5);
  color: var(--text-primary, #333);
  transition: background-color 0.3s, color 0.3s;
}

.app {
  min-height: 100vh;
}

/* 主题变量 */
:root {
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --bg-hover: #f0f0f0;
  --bg-active: #e3f2fd;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #e0e0e0;
  --primary-color: #2196f3;
}

.dark {
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --bg-card: #2d2d2d;
  --bg-hover: #2a2a2a;
  --bg-active: #1e3a5f;
  --text-primary: #e0e0e0;
  --text-secondary: #aaaaaa;
  --border-color: #333333;
  --primary-color: #64b5f6;
}
</style>

