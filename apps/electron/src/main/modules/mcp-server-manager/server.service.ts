import type { Server, ServerConfig } from '@mcp_router/shared/types';
import { ServerRepository } from './server.repository';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import { randomUUID } from 'crypto';

/**
 * Server Service
 * 业务逻辑层，处理服务器的CRUD操作
 */
export class ServerService {
  private repository: ServerRepository | null = null;
  private dbManager: SqliteManager;

  constructor(dbManager: SqliteManager) {
    this.dbManager = dbManager;
  }

  /**
   * 获取Repository实例
   */
  private getRepository(): ServerRepository {
    if (!this.repository) {
      const db = this.dbManager.getWorkspaceDatabase() || this.dbManager.getMainDatabase();
      this.repository = new ServerRepository(db);
    }
    return this.repository;
  }

  /**
   * 获取所有服务器
   */
  listServers(): Server[] {
    const repo = this.getRepository();
    return repo.findAll();
  }

  /**
   * 根据ID获取服务器
   */
  getServerById(id: string): Server | null {
    const repo = this.getRepository();
    return repo.findById(id);
  }

  /**
   * 创建服务器
   */
  createServer(data: {
    name: string;
    transport: 'stdio' | 'http' | 'sse';
    config: ServerConfig;
    enabled?: boolean;
  }): Server {
    const repo = this.getRepository();
    const now = Math.floor(Date.now() / 1000);
    const maxOrder = Math.max(0, ...repo.findAll().map((s) => s.orderIndex));

    const server: Server = {
      id: randomUUID(),
      name: data.name,
      enabled: data.enabled ?? false,
      transport: data.transport,
      config: data.config,
      orderIndex: maxOrder + 1,
      createdAt: now,
      updatedAt: now,
    };

    repo.create(server);
    return server;
  }

  /**
   * 更新服务器
   */
  updateServer(id: string, updates: Partial<Server>): Server | null {
    const repo = this.getRepository();
    const existing = repo.findById(id);
    if (!existing) {
      return null;
    }

    const updated: Server = {
      ...existing,
      ...updates,
      id, // 确保ID不变
      updatedAt: Math.floor(Date.now() / 1000),
    };

    repo.update(id, updated);
    return repo.findById(id);
  }

  /**
   * 删除服务器
   */
  deleteServer(id: string): boolean {
    const repo = this.getRepository();
    return repo.delete(id);
  }

  /**
   * 启用/禁用服务器
   */
  toggleServer(id: string, enabled: boolean): boolean {
    const repo = this.getRepository();
    const server = repo.findById(id);
    if (!server) {
      return false;
    }

    repo.updateEnabled(id, enabled);
    return true;
  }

  /**
   * 更新服务器顺序
   */
  updateServerOrder(serverId: string, orderIndex: number): void {
    const repo = this.getRepository();
    repo.updateOrder(serverId, orderIndex);
  }

  /**
   * 获取所有启用的服务器
   */
  getEnabledServers(): Server[] {
    const repo = this.getRepository();
    return repo.findAllEnabled();
  }
}

