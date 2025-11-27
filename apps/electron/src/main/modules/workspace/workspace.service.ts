import type { Workspace } from '@mcp_router/shared/types';
import { WorkspaceRepository } from './workspace.repository';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import { SchemaManager } from '../../infrastructure/database/schema-manager';
import { randomUUID } from 'crypto';

/**
 * Workspace Service
 * 业务逻辑层，处理工作区的CRUD操作和切换
 */
export class WorkspaceService {
  private repository: WorkspaceRepository | null = null;
  private dbManager: SqliteManager;
  private schemaManager: SchemaManager;
  private currentWorkspaceId: string | null = null;

  constructor(dbManager: SqliteManager, schemaManager: SchemaManager) {
    this.dbManager = dbManager;
    this.schemaManager = schemaManager;
  }

  /**
   * 获取Repository实例（使用主数据库）
   */
  private getRepository(): WorkspaceRepository {
    if (!this.repository) {
      const db = this.dbManager.getMainDatabase();
      this.repository = new WorkspaceRepository(db);
    }
    return this.repository;
  }

  /**
   * 获取所有工作区
   */
  listWorkspaces(): Workspace[] {
    const repo = this.getRepository();
    return repo.findAllSorted();
  }

  /**
   * 根据ID获取工作区
   */
  getWorkspaceById(id: string): Workspace | null {
    const repo = this.getRepository();
    return repo.findById(id);
  }

  /**
   * 创建本地工作区
   */
  createLocalWorkspace(name: string): Workspace {
    const repo = this.getRepository();
    const now = Math.floor(Date.now() / 1000);

    const workspace: Workspace = {
      id: randomUUID(),
      name,
      type: 'local',
      createdAt: now,
    };

    repo.create(workspace);

    // 创建工作区数据库
    this.dbManager.switchWorkspace(workspace.id);
    this.schemaManager.initializeWorkspaceDatabase();
    // 只关闭工作区数据库，保留主数据库打开
    this.dbManager.closeWorkspaceDatabase();

    return workspace;
  }

  /**
   * 创建远程工作区
   */
  createRemoteWorkspace(name: string, config: { apiUrl: string; auth?: Record<string, unknown> }): Workspace {
    const repo = this.getRepository();
    const now = Math.floor(Date.now() / 1000);

    const workspace: Workspace = {
      id: randomUUID(),
      name,
      type: 'remote',
      createdAt: now,
      config: {
        apiUrl: config.apiUrl,
        auth: config.auth,
      },
    };

    repo.create(workspace);
    return workspace;
  }

  /**
   * 更新工作区
   */
  updateWorkspace(id: string, updates: Partial<Workspace>): Workspace | null {
    const repo = this.getRepository();
    const existing = repo.findById(id);
    if (!existing) {
      return null;
    }

    const updated: Workspace = {
      ...existing,
      ...updates,
      id, // 确保ID不变
    };

    repo.update(id, updated);
    return repo.findById(id);
  }

  /**
   * 删除工作区
   */
  deleteWorkspace(id: string): boolean {
    const repo = this.getRepository();
    
    // 如果删除的是当前工作区，先切换到其他工作区
    if (this.currentWorkspaceId === id) {
      const allWorkspaces = repo.findAll();
      const otherWorkspace = allWorkspaces.find((w) => w.id !== id);
      if (otherWorkspace) {
        this.switchWorkspace(otherWorkspace.id);
      } else {
        // 如果没有其他工作区，只关闭工作区数据库（保留主数据库）
        this.dbManager.closeWorkspaceDatabase();
        this.currentWorkspaceId = null;
      }
    }

    return repo.delete(id);
  }

  /**
   * 切换工作区
   */
  switchWorkspace(id: string): void {
    // 确保主数据库是打开的（用于查询工作区信息）
    const repo = this.getRepository();
    const workspace = repo.findById(id);
    if (!workspace) {
      throw new Error(`工作区 ${id} 不存在`);
    }

    // 关闭当前工作区数据库（只关闭工作区数据库，保留主数据库）
    if (this.currentWorkspaceId) {
      this.dbManager.closeWorkspaceDatabase();
    }

    // 打开新工作区数据库
    if (workspace.type === 'local') {
      this.dbManager.switchWorkspace(id);
      // 确保工作区数据库已初始化
      this.schemaManager.initializeWorkspaceDatabase();
    } else {
      // 远程工作区：TODO 实现远程连接
      throw new Error('远程工作区尚未实现');
    }

    this.currentWorkspaceId = id;

    // 更新最后使用时间（主数据库必须保持打开）
    repo.updateLastUsed(id);
  }

  /**
   * 获取当前工作区ID
   */
  getCurrentWorkspaceId(): string | null {
    return this.currentWorkspaceId;
  }

  /**
   * 初始化默认工作区（如果不存在）
   */
  initializeDefaultWorkspace(): Workspace {
    const repo = this.getRepository();
    const workspaces = repo.findAll();

    if (workspaces.length === 0) {
      // 创建默认工作区
      const defaultWorkspace = this.createLocalWorkspace('Default');
      this.switchWorkspace(defaultWorkspace.id);
      return defaultWorkspace;
    } else {
      // 使用最近使用的工作区
      const sorted = repo.findAllSorted();
      const mostRecent = sorted[0];
      if (!this.currentWorkspaceId) {
        this.switchWorkspace(mostRecent.id);
      }
      return mostRecent;
    }
  }
}

