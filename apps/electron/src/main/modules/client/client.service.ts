import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import { ClientRepository } from './client.repository';
import type { Client } from '@mcp_router/shared/types';

/**
 * Client Service
 * 业务逻辑层，处理客户端的CRUD操作和Token管理
 */
export class ClientService {
  private repository: ClientRepository;

  constructor(db: Database.Database) {
    this.repository = new ClientRepository(db);
  }

  /**
   * 获取所有客户端
   */
  listClients(): Client[] {
    return this.repository.findAll();
  }

  /**
   * 根据ID获取客户端
   */
  getClientById(id: string): Client | null {
    return this.repository.findById(id);
  }

  /**
   * 根据Token获取客户端
   */
  getClientByToken(token: string): Client | null {
    return this.repository.findByToken(token);
  }

  /**
   * 创建新客户端
   */
  createClient(input: {
    name: string;
    type: 'predefined' | 'custom';
  }): Client {
    const now = Math.floor(Date.now() / 1000);
    const client: Client = {
      id: randomUUID(),
      name: input.name,
      type: input.type,
      createdAt: now,
    };

    return this.repository.create(client);
  }

  /**
   * 更新客户端
   */
  updateClient(id: string, updates: Partial<Client>): Client | null {
    return this.repository.update(id, updates);
  }

  /**
   * 删除客户端
   */
  deleteClient(id: string): boolean {
    return this.repository.delete(id);
  }

  /**
   * 生成Token
   */
  generateToken(): string {
    // 生成格式：mcpr_xxxxx
    const randomPart = randomUUID().replace(/-/g, '').substring(0, 16);
    return `mcpr_${randomPart}`;
  }

  /**
   * 为客户端生成Token
   */
  generateTokenForClient(id: string): Client | null {
    const token = this.generateToken();
    return this.repository.update(id, { token });
  }

  /**
   * 撤销Token
   */
  revokeToken(id: string): Client | null {
    return this.repository.update(id, { token: undefined });
  }

  /**
   * 更新最后连接时间
   */
  updateLastConnected(id: string): void {
    const now = Math.floor(Date.now() / 1000);
    this.repository.update(id, { lastConnectedAt: now });
  }
}

