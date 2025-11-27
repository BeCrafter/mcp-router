import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Workspace } from '@mcp_router/shared/types';

/**
 * Workspace Repository
 * 管理工作区的数据库操作（存储在主数据库）
 */
export class WorkspaceRepository extends BaseRepository<Workspace> {
  constructor(db: Database.Database) {
    super(db, 'workspaces');
  }

  /**
   * 创建实体（处理字段名转换：驼峰 -> 下划线）
   */
  create(entity: Workspace): Workspace {
    const stmt = this.db.prepare(`
      INSERT INTO workspaces (id, name, type, last_used_at, created_at, config)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      entity.id,
      entity.name,
      entity.type,
      entity.lastUsedAt || null,
      entity.createdAt,
      entity.config ? JSON.stringify(entity.config) : null
    );
    
    return entity;
  }

  /**
   * 根据ID查找实体（处理字段名转换：下划线 -> 驼峰）
   */
  findById(id: string): Workspace | null {
    const stmt = this.db.prepare('SELECT * FROM workspaces WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      lastUsedAt: row.last_used_at || undefined,
      createdAt: row.created_at,
      config: row.config ? JSON.parse(row.config) : undefined,
    };
  }

  /**
   * 查找所有实体（处理字段名转换）
   */
  findAll(): Workspace[] {
    const stmt = this.db.prepare('SELECT * FROM workspaces');
    const rows = stmt.all() as any[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      lastUsedAt: row.last_used_at || undefined,
      createdAt: row.created_at,
      config: row.config ? JSON.parse(row.config) : undefined,
    }));
  }

  /**
   * 更新实体（处理字段名转换）
   */
  update(id: string, updates: Partial<Workspace>): Workspace | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const updated: Workspace = {
      ...existing,
      ...updates,
      id, // 确保ID不变
    };

    const stmt = this.db.prepare(`
      UPDATE workspaces 
      SET name = ?, type = ?, last_used_at = ?, created_at = ?, config = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updated.name,
      updated.type,
      updated.lastUsedAt || null,
      updated.createdAt,
      updated.config ? JSON.stringify(updated.config) : null,
      id
    );

    return this.findById(id);
  }

  /**
   * 根据类型查找工作区
   */
  findByType(type: 'local' | 'remote'): Workspace[] {
    const stmt = this.db.prepare('SELECT * FROM workspaces WHERE type = ? ORDER BY last_used_at DESC');
    const rows = stmt.all(type) as any[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      lastUsedAt: row.last_used_at || undefined,
      createdAt: row.created_at,
      config: row.config ? JSON.parse(row.config) : undefined,
    }));
  }

  /**
   * 更新最后使用时间
   */
  updateLastUsed(id: string): void {
    const stmt = this.db.prepare(
      'UPDATE workspaces SET last_used_at = strftime(\'%s\', \'now\') WHERE id = ?'
    );
    stmt.run(id);
  }

  /**
   * 获取所有工作区（按最后使用时间排序）
   */
  findAllSorted(): Workspace[] {
    const stmt = this.db.prepare('SELECT * FROM workspaces ORDER BY last_used_at DESC, created_at DESC');
    const rows = stmt.all() as any[];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      lastUsedAt: row.last_used_at || undefined,
      createdAt: row.created_at,
      config: row.config ? JSON.parse(row.config) : undefined,
    }));
  }
}

