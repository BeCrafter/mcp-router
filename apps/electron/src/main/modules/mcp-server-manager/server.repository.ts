import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Server } from '@mcp_router/shared/types';

/**
 * Server Repository
 * 管理MCP服务器的数据库操作
 */
export class ServerRepository extends BaseRepository<Server> {
  constructor(db: Database.Database) {
    super(db, 'servers');
  }

  /**
   * 根据启用状态查找服务器
   */
  findByEnabled(enabled: boolean): Server[] {
    const stmt = this.db.prepare('SELECT * FROM servers WHERE enabled = ? ORDER BY order_index');
    return stmt.all(enabled ? 1 : 0) as Server[];
  }

  /**
   * 更新服务器顺序
   */
  updateOrder(serverId: string, orderIndex: number): void {
    const stmt = this.db.prepare('UPDATE servers SET order_index = ? WHERE id = ?');
    stmt.run(orderIndex, serverId);
  }

  /**
   * 更新服务器启用状态
   */
  updateEnabled(serverId: string, enabled: boolean): void {
    const stmt = this.db.prepare('UPDATE servers SET enabled = ?, updated_at = strftime(\'%s\', \'now\') WHERE id = ?');
    stmt.run(enabled ? 1 : 0, serverId);
  }

  /**
   * 获取所有启用的服务器
   */
  findAllEnabled(): Server[] {
    return this.findByEnabled(true);
  }
}

