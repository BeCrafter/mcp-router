import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Settings } from '@mcp_router/shared/types';

/**
 * Settings Repository
 * 管理应用设置的数据库操作
 */
export class SettingsRepository extends BaseRepository<{ key: string; value: string }> {
  constructor(db: Database.Database) {
    super(db, 'settings');
  }

  /**
   * 获取所有设置
   */
  getAllSettings(): Record<string, unknown> {
    const all = this.findAll();
    const settings: Record<string, unknown> = {};

    for (const item of all) {
      try {
        settings[item.key] = JSON.parse(item.value);
      } catch {
        // 如果解析失败，使用原始值
        settings[item.key] = item.value;
      }
    }

    return settings;
  }

  /**
   * 获取单个设置值
   */
  getSetting(key: string): unknown {
    const item = this.findById(key);
    if (!item) {
      return undefined;
    }

    try {
      return JSON.parse(item.value);
    } catch {
      return item.value;
    }
  }

  /**
   * 保存设置
   */
  saveSetting(key: string, value: unknown): void {
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    const existing = this.findById(key);

    if (existing) {
      // 使用SQL直接更新，避免BaseRepository的update方法问题
      const stmt = this.db.prepare('UPDATE settings SET value = ?, updated_at = strftime(\'%s\', \'now\') WHERE key = ?');
      stmt.run(valueStr, key);
    } else {
      this.create({ key, value: valueStr });
    }
  }

  /**
   * 保存多个设置
   */
  saveSettings(settings: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(settings)) {
      this.saveSetting(key, value);
    }
  }

  /**
   * 删除设置
   */
  deleteSetting(key: string): boolean {
    return this.delete(key);
  }
}

