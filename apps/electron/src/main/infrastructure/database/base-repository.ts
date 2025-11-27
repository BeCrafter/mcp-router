import Database from 'better-sqlite3';

/**
 * 基础Repository抽象类
 * 提供通用的CRUD操作
 */
export abstract class BaseRepository<T extends { id: string }> {
  protected db: Database.Database;
  protected tableName: string;

  constructor(db: Database.Database, tableName: string) {
    this.db = db;
    this.tableName = tableName;
  }

  /**
   * 根据ID查找实体
   */
  findById(id: string): T | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    return (stmt.get(id) as T) || null;
  }

  /**
   * 查找所有实体
   */
  findAll(): T[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return stmt.all() as T[];
  }

  /**
   * 创建实体
   */
  create(entity: T): T {
    const keys = Object.keys(entity);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((key) => (entity as any)[key]);
    const columns = keys.join(', ');

    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`
    );
    stmt.run(...values);
    return entity;
  }

  /**
   * 更新实体
   */
  update(id: string, updates: Partial<T>): T | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const keys = Object.keys(updates).filter((key) => key !== 'id');
    if (keys.length === 0) {
      return existing;
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) => (updates as any)[key]);
    values.push(id);

    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`
    );
    stmt.run(...values);

    return this.findById(id);
  }

  /**
   * 删除实体
   */
  delete(id: string): boolean {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * 检查实体是否存在
   */
  exists(id: string): boolean {
    const stmt = this.db.prepare(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE id = ?`
    );
    const result = stmt.get(id) as { count: number };
    return result.count > 0;
  }
}

