import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 确保DOM加载完成后再挂载
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
  });
} else {
  app.mount('#app');
}

