import { SqliteManager } from './sqlite-manager';

/**
 * 数据库Schema管理器
 * 负责创建表结构和执行迁移
 */
export class SchemaManager {
  private dbManager: SqliteManager;

  constructor(dbManager: SqliteManager) {
    this.dbManager = dbManager;
  }

  /**
   * 初始化主数据库Schema
   */
  initializeMainDatabase(): void {
    const db = this.dbManager.getMainDatabase();

    // 创建工作区表
    db.exec(`
      CREATE TABLE IF NOT EXISTS workspaces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'local',
        last_used_at INTEGER,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        config TEXT
      )
    `);

    // 创建索引
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_workspaces_last_used 
      ON workspaces(last_used_at DESC)
    `);
  }

  /**
   * 初始化工作区数据库Schema
   */
  initializeWorkspaceDatabase(): void {
    const db = this.dbManager.getWorkspaceDatabase();
    if (!db) {
      throw new Error('工作区数据库未初始化');
    }

    // 创建设置表（如果不存在）
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建服务器表
    db.exec(`
      CREATE TABLE IF NOT EXISTS servers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 0,
        transport TEXT NOT NULL,
        config TEXT NOT NULL,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建项目表
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建服务器-项目关联表
    db.exec(`
      CREATE TABLE IF NOT EXISTS server_projects (
        server_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        PRIMARY KEY (server_id, project_id),
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    // 创建工作流表
    db.exec(`
      CREATE TABLE IF NOT EXISTS workflows (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        trigger_type TEXT NOT NULL,
        enabled INTEGER NOT NULL DEFAULT 0,
        nodes TEXT NOT NULL,
        edges TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建Hook模块表
    db.exec(`
      CREATE TABLE IF NOT EXISTS hook_modules (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        code TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
      )
    `);

    // 创建客户端表
    db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        token TEXT,
        created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
        last_connected_at INTEGER
      )
    `);

    // 创建索引
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_servers_order 
      ON servers(order_index)
    `);
    
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_servers_enabled 
      ON servers(enabled)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_workflows_enabled 
      ON workflows(enabled)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_workflows_trigger_type 
      ON workflows(trigger_type)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_clients_token 
      ON clients(token)
    `);

    // 添加更多性能优化索引
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_projects_created_at 
      ON projects(created_at DESC)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_server_projects_server_id 
      ON server_projects(server_id)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_server_projects_project_id 
      ON server_projects(project_id)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_servers_created_at 
      ON servers(created_at DESC)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_workflows_created_at 
      ON workflows(created_at DESC)
    `);

    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_hook_modules_name 
      ON hook_modules(name)
    `);
  }

  /**
   * 执行数据库迁移
   * 后续阶段可以添加迁移逻辑
   */
  migrate(): void {
    // 初始化主数据库
    this.initializeMainDatabase();

    // 如果当前有工作区，初始化工作区数据库
    const workspaceId = this.dbManager.getCurrentWorkspaceId();
    if (workspaceId) {
      this.initializeWorkspaceDatabase();
    }
  }
}

