<template>
  <MainLayout>
    <div class="settings-page">
    <h1 class="text-2xl font-bold mb-6">设置</h1>

    <div class="settings-content">
      <!-- 通用设置 -->
      <section class="settings-section">
        <h2 class="text-xl font-semibold mb-4">通用</h2>

        <div class="setting-item">
          <label for="theme" class="setting-label">主题</label>
          <Select
            id="theme"
            name="theme"
            :model-value="settingsStore.settings.theme"
            :options="themeOptions"
            @update:model-value="handleThemeChange"
          />
        </div>

        <div class="setting-item">
          <label for="language" class="setting-label">语言</label>
          <Select
            id="language"
            name="language"
            :model-value="settingsStore.settings.language"
            :options="languageOptions"
            @update:model-value="handleLanguageChange"
          />
        </div>

        <div class="setting-item">
          <label class="setting-label">
            <input
              type="checkbox"
              :checked="settingsStore.settings.showWindowOnStartup"
              @change="handleShowWindowOnStartupChange"
            />
            <span class="ml-2">启动时显示窗口</span>
          </label>
        </div>
      </section>
    </div>
  </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { useTheme } from '../composables/useTheme';
import MainLayout from '../components/layout/MainLayout.vue';
import Select from '../components/common/Select.vue';

const settingsStore = useSettingsStore();
const { setTheme } = useTheme();

const themeOptions = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' },
];

const languageOptions = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
];

const handleThemeChange = async (value: string) => {
  await setTheme(value as 'light' | 'dark' | 'system');
};

const handleLanguageChange = async (value: string) => {
  await settingsStore.saveSettings({ language: value });
};

const handleShowWindowOnStartupChange = async (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  await settingsStore.saveSettings({ showWindowOnStartup: checked });
};

onMounted(() => {
  settingsStore.initialize();
});
</script>

<style scoped>
.settings-page {
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 32px;
  padding: 20px;
  background: var(--bg-card, #fff);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.setting-item {
  margin-bottom: 16px;
}

.setting-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-primary, #333);
}
</style>

