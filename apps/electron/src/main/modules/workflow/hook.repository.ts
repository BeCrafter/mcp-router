import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { HookModule } from '@mcp_router/shared/types';

/**
 * Hook Module Repository
 * 管理Hook模块的数据库操作
 */
export class HookRepository extends BaseRepository<HookModule> {
  constructor(db: Database.Database) {
    super(db, 'hook_modules');
  }

  private mapRowToHook(row: any): HookModule {
    if (!row) return row;
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      code: row.code,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapHookToRow(hook: Partial<HookModule>): any {
    const row: any = { ...hook };
    if (row.createdAt !== undefined) {
      row.created_at = row.createdAt;
      delete row.createdAt;
    }
    if (row.updatedAt !== undefined) {
      row.updated_at = row.updatedAt;
      delete row.updatedAt;
    }
    return row;
  }

  findById(id: string): HookModule | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const row = stmt.get(id);
    return this.mapRowToHook(row);
  }

  findAll(): HookModule[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return (stmt.all() as any[]).map(this.mapRowToHook);
  }

  create(entity: HookModule): HookModule {
    const row = this.mapHookToRow(entity);
    const keys = Object.keys(row);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((key) => row[key]);
    const columns = keys.join(', ');

    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`
    );
    stmt.run(...values);
    return entity;
  }

  update(id: string, updates: Partial<HookModule>): HookModule | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const updatedRow = this.mapHookToRow(updates);
    const keys = Object.keys(updatedRow).filter((key) => key !== 'id');
    if (keys.length === 0) {
      return existing;
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) => updatedRow[key]);
    values.push(id);

    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${setClause}, updated_at = strftime('%s', 'now') WHERE id = ?`
    );
    stmt.run(...values);

    return this.findById(id);
  }
}

