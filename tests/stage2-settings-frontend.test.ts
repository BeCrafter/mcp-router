import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '../apps/electron/src/renderer/stores/settings';

// Mock Platform API
const mockSettings = {
  theme: 'system' as const,
  showWindowOnStartup: true,
  language: 'zh',
};

const mockPlatformAPI = {
  settings: {
    get: vi.fn(async () => mockSettings),
    save: vi.fn(async (settings: any) => ({ ...mockSettings, ...settings })),
  },
};

// Mock window.platformAPI
Object.defineProperty(window, 'platformAPI', {
  value: mockPlatformAPI,
  writable: true,
});

describe('Settings前端验证', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('Store应该可以获取设置', async () => {
    const store = useSettingsStore();
    await store.fetchSettings();

    expect(store.settings).toBeDefined();
    expect(store.settings.theme).toBe('system');
    expect(mockPlatformAPI.settings.get).toHaveBeenCalled();
  });

  it('Store应该可以保存设置', async () => {
    const store = useSettingsStore();
    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'en',
    };

    await store.saveSettings(newSettings);
    expect(store.settings.theme).toBe('dark');
    expect(mockPlatformAPI.settings.save).toHaveBeenCalledWith(newSettings);
  });

  it('Store应该可以计算当前主题', () => {
    const store = useSettingsStore();
    store.settings.theme = 'light';
    expect(store.currentTheme).toBe('light');

    store.settings.theme = 'dark';
    expect(store.currentTheme).toBe('dark');
  });
});

