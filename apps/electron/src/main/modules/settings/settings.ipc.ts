import { ipcHandlerRegistry } from '../../infrastructure/ipc';
import { SettingsService } from './settings.service';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import type { Settings } from '@mcp_router/shared';

/**
 * Settings IPC Handlers
 * 注册Settings相关的IPC处理函数
 */
export function setupSettingsHandlers(dbManager: SqliteManager): void {
  const settingsService = new SettingsService(dbManager);

  // 获取设置
  ipcHandlerRegistry.register<null, Settings>('settings:get', async () => {
    return settingsService.getSettings();
  });

  // 保存设置
  ipcHandlerRegistry.register<Partial<Settings>, Settings>(
    'settings:save',
    async (_, settings: Partial<Settings>) => {
      return settingsService.saveSettings(settings);
    }
  );

  // 重置设置
  ipcHandlerRegistry.register<null, Settings>('settings:reset', async () => {
    return settingsService.resetSettings();
  });
}

