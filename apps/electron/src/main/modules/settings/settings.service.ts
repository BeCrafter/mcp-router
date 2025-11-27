import type { Settings } from '@mcp_router/shared/types';
import { SettingsRepository } from './settings.repository';
import { DEFAULT_SETTINGS } from '../../constants';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';

/**
 * Settings Service
 * 业务逻辑层，处理设置的获取和保存
 */
export class SettingsService {
  private repository: SettingsRepository | null = null;
  private dbManager: SqliteManager;

  constructor(dbManager: SqliteManager) {
    this.dbManager = dbManager;
  }

  /**
   * 获取Repository实例
   */
  private getRepository(): SettingsRepository {
    if (!this.repository) {
      // Settings存储在workspace数据库中，如果没有workspace则使用main数据库
      let db = this.dbManager.getWorkspaceDatabase();
      if (!db) {
        // 如果没有workspace，使用main数据库，但需要确保settings表存在
        db = this.dbManager.getMainDatabase();
        // 确保settings表存在（在main数据库中）
        db.exec(`
          CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
          )
        `);
      }
      this.repository = new SettingsRepository(db);
    }
    return this.repository;
  }

  /**
   * 获取所有设置
   * 如果设置不存在，返回默认值
   */
  getSettings(): Settings {
    const repo = this.getRepository();
    const saved = repo.getAllSettings();

    // 合并默认设置和保存的设置
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
    } as Settings;
  }

  /**
   * 保存设置
   */
  saveSettings(settings: Partial<Settings>): Settings {
    const repo = this.getRepository();
    const current = this.getSettings();

    // 合并当前设置和新设置
    const updated = {
      ...current,
      ...settings,
    } as Settings;

    // 保存到数据库
    repo.saveSettings(updated);

    return updated;
  }

  /**
   * 获取单个设置值
   */
  getSetting<K extends keyof Settings>(key: K): Settings[K] {
    const repo = this.getRepository();
    const value = repo.getSetting(key);
    return (value ?? DEFAULT_SETTINGS[key]) as Settings[K];
  }

  /**
   * 保存单个设置值
   */
  saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    const repo = this.getRepository();
    repo.saveSetting(key, value);
  }

  /**
   * 重置设置为默认值
   */
  resetSettings(): Settings {
    const repo = this.getRepository();
    repo.saveSettings(DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS } as Settings;
  }
}

