import { defineStore } from 'pinia';
import type { Settings } from '@mcp_router/shared/types';

/**
 * Settings Store
 * 管理应用设置的状态
 */
export const useSettingsStore = defineStore('settings', {
  state: (): { settings: Settings } => ({
    settings: {
      theme: 'system',
      showWindowOnStartup: true,
      language: 'zh',
    },
  }),

  getters: {
    /**
     * 获取当前主题
     */
    currentTheme(): 'light' | 'dark' {
      const theme = this.settings.theme;
      if (theme === 'system') {
        // 检测系统主题
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    },
  },

  actions: {
    /**
     * 从后端获取设置
     */
    async fetchSettings(): Promise<void> {
      try {
        const settings = await window.platformAPI.settings.get();
        this.settings = settings as Settings;
      } catch (error) {
        console.error('获取设置失败:', error);
      }
    },

    /**
     * 保存设置
     */
    async saveSettings(newSettings: Partial<Settings>): Promise<void> {
      try {
        const saved = await window.platformAPI.settings.save(newSettings);
        this.settings = saved as Settings;
        
        // 应用主题变更
        if (newSettings.theme !== undefined) {
          this.applyTheme();
        }
      } catch (error) {
        console.error('保存设置失败:', error);
        throw error;
      }
    },

    /**
     * 应用主题
     */
    applyTheme(): void {
      const theme = this.currentTheme;
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    },

    /**
     * 初始化设置
     */
    async initialize(): Promise<void> {
      await this.fetchSettings();
      this.applyTheme();
    },
  },
});

