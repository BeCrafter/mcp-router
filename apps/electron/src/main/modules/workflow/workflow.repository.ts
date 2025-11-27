import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { WorkflowDefinition } from '@mcp_router/shared/types';

/**
 * Workflow Repository
 * 管理工作流的数据库操作
 */
export class WorkflowRepository extends BaseRepository<WorkflowDefinition> {
  constructor(db: Database.Database) {
    super(db, 'workflows');
  }

  private mapRowToWorkflow(row: any): WorkflowDefinition {
    if (!row) return row;
    return {
      id: row.id,
      name: row.name,
      description: row.description || undefined,
      triggerType: row.trigger_type as 'tools/list' | 'tools/call' | 'manual',
      enabled: Boolean(row.enabled),
      nodes: JSON.parse(row.nodes || '[]'),
      edges: JSON.parse(row.edges || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapWorkflowToRow(workflow: Partial<WorkflowDefinition>): any {
    const row: any = { ...workflow };
    if (row.triggerType !== undefined) {
      row.trigger_type = row.triggerType;
      delete row.triggerType;
    }
    if (row.createdAt !== undefined) {
      row.created_at = row.createdAt;
      delete row.createdAt;
    }
    if (row.updatedAt !== undefined) {
      row.updated_at = row.updatedAt;
      delete row.updatedAt;
    }
    if (row.nodes !== undefined) {
      row.nodes = JSON.stringify(row.nodes);
    }
    if (row.edges !== undefined) {
      row.edges = JSON.stringify(row.edges);
    }
    if (row.enabled !== undefined) {
      row.enabled = row.enabled ? 1 : 0;
    }
    return row;
  }

  findById(id: string): WorkflowDefinition | null {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const row = stmt.get(id);
    return this.mapRowToWorkflow(row);
  }

  findAll(): WorkflowDefinition[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName}`);
    return (stmt.all() as any[]).map(this.mapRowToWorkflow);
  }

  findByTriggerType(triggerType: string): WorkflowDefinition[] {
    const stmt = this.db.prepare(
      `SELECT * FROM ${this.tableName} WHERE trigger_type = ? AND enabled = 1`
    );
    return (stmt.all(triggerType) as any[]).map(this.mapRowToWorkflow);
  }

  create(entity: WorkflowDefinition): WorkflowDefinition {
    const row = this.mapWorkflowToRow(entity);
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

  update(id: string, updates: Partial<WorkflowDefinition>): WorkflowDefinition | null {
    const existing = this.findById(id);
    if (!existing) {
      return null;
    }

    const updatedRow = this.mapWorkflowToRow(updates);
    const keys = Object.keys(updatedRow).filter((key) => key !== 'id');
    if (keys.length === 0) {
      return existing;
    }

    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    const values = keys.map((key) => updatedRow[key]);
    values.push(id);

    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${setClause}, updated_at = strftime('%s', 'now') WHERE id = ?`
    );
    stmt.run(...values);

    return this.findById(id);
  }
}

