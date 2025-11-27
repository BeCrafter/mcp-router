import { ref, watch, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';

export type Theme = 'light' | 'dark' | 'system';

/**
 * 主题管理 Composable
 */
export function useTheme() {
  const settingsStore = useSettingsStore();
  const currentTheme = ref<Theme>('system');
  const effectiveTheme = ref<'light' | 'dark'>('light');

  /**
   * 检测系统主题
   */
  const detectSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  /**
   * 应用主题
   */
  const applyTheme = (theme: 'light' | 'dark') => {
    effectiveTheme.value = theme;
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  /**
   * 设置主题
   */
  const setTheme = async (theme: Theme) => {
    currentTheme.value = theme;
    
    let effective: 'light' | 'dark';
    if (theme === 'system') {
      effective = detectSystemTheme();
    } else {
      effective = theme;
    }
    
    applyTheme(effective);
    
    // 保存到设置
    await settingsStore.saveSettings({
      ...settingsStore.settings,
      theme,
    });
  };

  /**
   * 初始化主题
   */
  const initTheme = async () => {
    // 从设置加载主题
    const savedTheme = settingsStore.settings.theme || 'system';
    currentTheme.value = savedTheme as Theme;
    
    let effective: 'light' | 'dark';
    if (savedTheme === 'system') {
      effective = detectSystemTheme();
      // 监听系统主题变化
      if (typeof window !== 'undefined' && window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          if (currentTheme.value === 'system') {
            applyTheme(e.matches ? 'dark' : 'light');
          }
        };
        mediaQuery.addEventListener('change', handleChange);
      }
    } else {
      effective = savedTheme as 'light' | 'dark';
    }
    
    applyTheme(effective);
  };

  onMounted(() => {
    initTheme();
  });

  return {
    currentTheme,
    effectiveTheme,
    setTheme,
    initTheme,
  };
}

