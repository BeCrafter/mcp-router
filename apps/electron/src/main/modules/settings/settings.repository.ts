import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Settings } from '@mcp_router/shared/types';

/**
 * Settings Repository
 * 管理应用设置的数据库操作
 * 注意：settings表使用key作为主键，不是id
 */
export class SettingsRepository extends BaseRepository<{ key: string; value: string; id: string }> {
  constructor(db: Database.Database) {
    super(db, 'settings');
  }

  /**
   * 重写findById，使用key而不是id
   */
  findById(key: string): { key: string; value: string; id: string } | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE key = ?`);
    const result = stmt.get(key) as { key: string; value: string } | undefined;
    if (!result) {
      return null;
    }
    // 为了兼容BaseRepository的类型，添加id字段（使用key作为id）
    return { ...result, id: result.key };
  }

  /**
   * 重写delete，使用key而不是id
   */
  delete(key: string): boolean {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE key = ?`);
    const result = stmt.run(key);
    return result.changes > 0;
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
      // 使用SQL直接更新
      const stmt = this.db.prepare('UPDATE settings SET value = ?, updated_at = strftime(\'%s\', \'now\') WHERE key = ?');
      stmt.run(valueStr, key);
    } else {
      // 创建新设置
      const stmt = this.db.prepare('INSERT INTO settings (key, value, updated_at) VALUES (?, ?, strftime(\'%s\', \'now\'))');
      stmt.run(key, valueStr);
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

