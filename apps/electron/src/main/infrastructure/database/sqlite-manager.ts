import Database from 'better-sqlite3';
import { app } from 'electron';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * SQLite数据库管理器
 * 负责管理主数据库和工作区数据库的连接
 */
export class SqliteManager {
  private mainDb: Database.Database | null = null;
  private workspaceDb: Database.Database | null = null;
  private currentWorkspaceId: string | null = null;
  private readonly dataDir: string;

  constructor(dataDir?: string) {
    // 使用应用数据目录或指定的目录
    this.dataDir = dataDir || path.join(app.getPath('userData'), 'data');
    
    // 确保数据目录存在
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }
  }

  /**
   * 获取主数据库连接
   * 主数据库存储工作区元数据、全局设置等
   */
  getMainDatabase(): Database.Database {
    if (!this.mainDb) {
      const dbPath = path.join(this.dataDir, 'mcprouter.db');
      this.mainDb = new Database(dbPath);
      this.mainDb.pragma('journal_mode = WAL'); // 启用WAL模式提高并发性能
    }
    return this.mainDb;
  }

  /**
   * 获取当前工作区数据库连接
   * 如果工作区未切换或不存在，返回null
   */
  getWorkspaceDatabase(): Database.Database | null {
    return this.workspaceDb;
  }

  /**
   * 切换到指定工作区
   * @param workspaceId 工作区ID
   */
  switchWorkspace(workspaceId: string): void {
    // 关闭当前工作区数据库
    if (this.workspaceDb) {
      this.workspaceDb.close();
      this.workspaceDb = null;
    }

    // 打开新工作区数据库
    const dbPath = path.join(this.dataDir, `workspace-${workspaceId}.db`);
    this.workspaceDb = new Database(dbPath);
    this.workspaceDb.pragma('journal_mode = WAL');
    this.currentWorkspaceId = workspaceId;
  }

  /**
   * 关闭工作区数据库连接（保留主数据库）
   */
  closeWorkspaceDatabase(): void {
    if (this.workspaceDb) {
      this.workspaceDb.close();
      this.workspaceDb = null;
    }
    this.currentWorkspaceId = null;
  }

  /**
   * 关闭所有数据库连接
   */
  close(): void {
    if (this.mainDb) {
      this.mainDb.close();
      this.mainDb = null;
    }
    if (this.workspaceDb) {
      this.workspaceDb.close();
      this.workspaceDb = null;
    }
    this.currentWorkspaceId = null;
  }

  /**
   * 获取当前工作区ID
   */
  getCurrentWorkspaceId(): string | null {
    return this.currentWorkspaceId;
  }

  /**
   * 获取数据目录路径
   */
  getDataDir(): string {
    return this.dataDir;
  }
}

