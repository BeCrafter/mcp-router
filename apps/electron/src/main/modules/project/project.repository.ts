import Database from 'better-sqlite3';
import { BaseRepository } from '../../infrastructure/database/base-repository';
import type { Project } from '@mcp_router/shared/types';

/**
 * Project Repository
 * 管理项目的数据库操作
 */
export class ProjectRepository extends BaseRepository<Project> {
  constructor(db: Database.Database) {
    super(db, 'projects');
  }

  /**
   * 获取项目的服务器ID列表
   */
  getProjectServerIds(projectId: string): string[] {
    const stmt = this.db.prepare(
      'SELECT server_id FROM server_projects WHERE project_id = ?'
    );
    const rows = stmt.all(projectId) as Array<{ server_id: string }>;
    return rows.map((row) => row.server_id);
  }

  /**
   * 添加服务器到项目
   */
  addServerToProject(projectId: string, serverId: string): void {
    const stmt = this.db.prepare(
      'INSERT OR IGNORE INTO server_projects (project_id, server_id) VALUES (?, ?)'
    );
    stmt.run(projectId, serverId);
  }

  /**
   * 从项目移除服务器
   */
  removeServerFromProject(projectId: string, serverId: string): void {
    const stmt = this.db.prepare(
      'DELETE FROM server_projects WHERE project_id = ? AND server_id = ?'
    );
    stmt.run(projectId, serverId);
  }

  /**
   * 获取项目的服务器数量
   */
  getProjectServerCount(projectId: string): number {
    const stmt = this.db.prepare(
      'SELECT COUNT(*) as count FROM server_projects WHERE project_id = ?'
    );
    const result = stmt.get(projectId) as { count: number };
    return result.count;
  }

  /**
   * 删除项目的所有服务器关联
   */
  removeAllServersFromProject(projectId: string): void {
    const stmt = this.db.prepare('DELETE FROM server_projects WHERE project_id = ?');
    stmt.run(projectId);
  }
}

