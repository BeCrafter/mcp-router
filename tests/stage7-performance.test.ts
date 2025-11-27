import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SqliteManager } from '../apps/electron/src/main/infrastructure/database/sqlite-manager';
import { SchemaManager } from '../apps/electron/src/main/infrastructure/database/schema-manager';

// Mock Electron app
vi.mock('electron', () => ({
  app: {
    getPath: vi.fn(() => '/tmp/test-data'),
    whenReady: vi.fn(() => Promise.resolve()),
  },
}));

describe('阶段7：性能优化测试', () => {
  let dbManager: SqliteManager;
  let schemaManager: SchemaManager;

  beforeEach(() => {
    dbManager = new SqliteManager('/tmp/test-performance');
    schemaManager = new SchemaManager(dbManager);
    schemaManager.migrate();
  });

  afterEach(() => {
    if (dbManager) {
      dbManager.close();
    }
  });

  describe('数据库索引性能', () => {
    it('应该使用索引优化查询性能', () => {
      const db = dbManager.getWorkspaceDatabase();
      if (!db) {
        throw new Error('工作区数据库未初始化');
      }

      // 测试索引是否存在
      const indexes = db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%'"
        )
        .all() as Array<{ name: string }>;

      const indexNames = indexes.map((idx) => idx.name);
      
      // 验证关键索引存在
      expect(indexNames).toContain('idx_servers_enabled');
      expect(indexNames).toContain('idx_servers_order');
      expect(indexNames).toContain('idx_projects_created_at');
      expect(indexNames).toContain('idx_server_projects_server_id');
      expect(indexNames).toContain('idx_server_projects_project_id');
    });

    it('索引应该提高查询性能', () => {
      const db = dbManager.getWorkspaceDatabase();
      if (!db) {
        throw new Error('工作区数据库未初始化');
      }

      // 插入测试数据
      const insertServer = db.prepare(
        'INSERT INTO servers (id, name, enabled, transport, config, order_index) VALUES (?, ?, ?, ?, ?, ?)'
      );

      for (let i = 0; i < 100; i++) {
        insertServer.run(
          `server-${i}`,
          `Server ${i}`,
          i % 2 === 0 ? 1 : 0,
          'stdio',
          JSON.stringify({ command: 'echo' }),
          i
        );
      }

      // 测试使用索引的查询性能
      const startTime = performance.now();
      const enabledServers = db
        .prepare('SELECT * FROM servers WHERE enabled = 1 ORDER BY order_index')
        .all();
      const endTime = performance.now();

      const queryTime = endTime - startTime;
      
      // 验证查询结果
      expect(enabledServers.length).toBe(50);
      // 验证查询时间合理（应该很快，因为有索引）
      expect(queryTime).toBeLessThan(100); // 100ms内完成
    });
  });

  describe('内存管理', () => {
    it('应该正确释放数据库连接', () => {
      const db1 = dbManager.getWorkspaceDatabase();
      expect(db1).toBeTruthy();

      dbManager.closeWorkspaceDatabase();
      
      // 关闭后应该无法访问
      expect(() => dbManager.getWorkspaceDatabase()).toThrow();
    });

    it('应该正确清理资源', async () => {
      // 创建多个数据库连接
      const db1 = dbManager.getWorkspaceDatabase();
      expect(db1).toBeTruthy();

      // 清理
      dbManager.closeWorkspaceDatabase();
      
      // 验证清理后状态
      expect(() => dbManager.getWorkspaceDatabase()).toThrow();
    });
  });
});

