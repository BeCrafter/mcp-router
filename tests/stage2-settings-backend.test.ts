import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SettingsService } from '../apps/electron/src/main/modules/settings/settings.service';
import { SettingsRepository } from '../apps/electron/src/main/modules/settings/settings.repository';
import { SqliteManager } from '../apps/electron/src/main/infrastructure/database/sqlite-manager';
import { SchemaManager } from '../apps/electron/src/main/infrastructure/database/schema-manager';
import { unlinkSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

// Mock Electron app
vi.mock('electron', () => ({
  app: {
    getPath: (name: string) => {
      if (name === 'userData') {
        return './test-data';
      }
      return './test-data';
    },
  },
}));

describe('Settings后端验证', () => {
  let dbManager: SqliteManager;
  let service: SettingsService;
  const testDataDir = './test-data';

  beforeEach(() => {
    dbManager = new SqliteManager(testDataDir);
    const schemaManager = new SchemaManager(dbManager);
    schemaManager.migrate();
    service = new SettingsService(dbManager);
  });

  afterEach(() => {
    dbManager.close();
    // 清理测试数据库文件
    try {
      const files = [
        join(testDataDir, 'mcprouter.db'),
        join(testDataDir, 'mcprouter.db-wal'),
        join(testDataDir, 'mcprouter.db-shm'),
      ];
      for (const file of files) {
        if (existsSync(file)) {
          unlinkSync(file);
        }
      }
      rmSync(testDataDir, { recursive: true, force: true });
    } catch {
      // 忽略清理错误
    }
  });

  it('应该可以获取默认设置', () => {
    const settings = service.getSettings();
    expect(settings).toBeDefined();
    expect(settings.theme).toBe('system');
    expect(settings.showWindowOnStartup).toBe(true);
    expect(settings.language).toBe('zh');
  });

  it('应该可以保存设置', () => {
    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'en',
    };

    const saved = service.saveSettings(newSettings);
    expect(saved.theme).toBe('dark');
    expect(saved.showWindowOnStartup).toBe(false);
    expect(saved.language).toBe('en');
  });

  it('应该可以持久化设置', () => {
    const newSettings = {
      theme: 'light' as const,
      showWindowOnStartup: true,
      language: 'en',
    };

    service.saveSettings(newSettings);
    const retrieved = service.getSettings();

    expect(retrieved.theme).toBe('light');
    expect(retrieved.showWindowOnStartup).toBe(true);
    expect(retrieved.language).toBe('en');
  });

  it('应该可以部分更新设置', () => {
    // 先保存完整设置
    service.saveSettings({
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'zh',
    });

    // 只更新主题
    const updated = service.saveSettings({ theme: 'light' as const });
    expect(updated.theme).toBe('light');
    expect(updated.showWindowOnStartup).toBe(false); // 保持原值
    expect(updated.language).toBe('zh'); // 保持原值
  });
});

