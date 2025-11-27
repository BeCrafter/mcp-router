import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SqliteManager } from '../apps/electron/src/main/infrastructure/database/sqlite-manager';
import { BaseRepository } from '../apps/electron/src/main/infrastructure/database/base-repository';
import { SchemaManager } from '../apps/electron/src/main/infrastructure/database/schema-manager';
import { unlinkSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

// Mock Electron app.getPath
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

describe('数据库系统验证', () => {
  let dbManager: SqliteManager;
  const testDataDir = './test-data';

  beforeEach(() => {
    dbManager = new SqliteManager(testDataDir);
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
      // 清理测试目录（如果为空）
      try {
        rmSync(testDataDir, { recursive: true, force: true });
      } catch {
        // 忽略目录清理错误
      }
    } catch {
      // 忽略清理错误
    }
  });

  it('应该可以创建数据库连接', () => {
    const database = dbManager.getMainDatabase();
    expect(database).toBeDefined();
  });

  it('应该可以创建表', () => {
    const database = dbManager.getMainDatabase();
    database.exec(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    const result = database
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='test_table'")
      .get();
    expect(result).toBeDefined();
  });

  it('应该可以插入和查询数据', () => {
    const database = dbManager.getMainDatabase();
    database.exec(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    database.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Test');
    const result = database
      .prepare('SELECT * FROM test_table WHERE id = ?')
      .get('1') as { id: string; name: string };

    expect(result).toBeDefined();
    expect(result.name).toBe('Test');
  });

  it('BaseRepository应该可以工作', () => {
    const database = dbManager.getMainDatabase();
    database.exec(`
      CREATE TABLE IF NOT EXISTS test_entities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    class TestRepository extends BaseRepository<{ id: string; name: string }> {
      constructor(db: typeof database) {
        super(db, 'test_entities');
      }
    }

    const repo = new TestRepository(database);
    const entity = { id: '1', name: 'Test' };

    // 创建
    repo.create(entity);
    expect(repo.exists('1')).toBe(true);

    // 查找
    const found = repo.findById('1');
    expect(found).toBeDefined();
    expect(found?.name).toBe('Test');

    // 更新
    repo.update('1', { name: 'Updated' });
    const updated = repo.findById('1');
    expect(updated?.name).toBe('Updated');

    // 删除
    repo.delete('1');
    expect(repo.exists('1')).toBe(false);
  });

  it('SchemaManager应该可以初始化数据库', () => {
    const schemaManager = new SchemaManager(dbManager);
    schemaManager.migrate();

    const database = dbManager.getMainDatabase();
    const tables = database
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all() as Array<{ name: string }>;

    expect(tables.some((t) => t.name === 'workspaces')).toBe(true);
  });
});

