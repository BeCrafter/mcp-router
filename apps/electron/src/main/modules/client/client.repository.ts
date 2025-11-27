import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Client } from '@mcp_router/shared/types';

/**
 * Client Repository
 * 管理客户端的数据库操作
 */
export class ClientRepository extends BaseRepository<Client> {
  constructor(db: Database.Database) {
    super(db, 'clients');
  }

  private mapRowToClient(row: any): Client {
    if (!row) return row;
    return {
      id: row.id,
      name: row.name,
      type: row.type as 'predefined' | 'custom',
      token: row.token || undefined,
      createdAt: row.created_at,
      lastConnectedAt: row.last_connected_at || undefined,
    };
  }

  private mapClientToRow(client: Partial<Client>): any {
    const row: any = { ...client };
    if (row.createdAt !== undefined) {
      row.created_at = row.createdAt;
      delete row.createdAt;
    }
    if (row.lastConnectedAt !== undefined) {
      row.last_connected_at = row.lastConnectedAt;
      delete row.lastConnectedAt;
    }
    return row;
  }

  findById(id: string): Client | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const row = stmt.get(id);
    return this.mapRowToClient(row);
  }

  findAll(): Client[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return (stmt.all() as any[]).map(this.mapRowToClient);
  }

  findByToken(token: string): Client | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE token = ?`);
    const row = stmt.get(token);
    return this.mapRowToClient(row);
  }

  create(entity: Client): Client {
    const row = this.mapClientToRow(entity);
    const keys = Object.keys(row);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map((key) => row[key]);
    const columns = keys.join(', ');

    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`
    );
    stmt.run(...values);
    return entity;
  }

  update(id: string, updates: Partial<Client>): Client | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const updatedRow = this.mapClientToRow(updates);
    const keys = Object.keys(updatedRow).filter((key) => key !== 'id');
    if (keys.length === 0) {
      return existing;
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) => updatedRow[key]);
    values.push(id);

    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`
    );
    stmt.run(...values);

    return this.findById(id);
  }
}

