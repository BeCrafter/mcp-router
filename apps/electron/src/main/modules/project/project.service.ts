import type { Project } from '@mcp_router/shared/types';
import { ProjectRepository } from './project.repository';
import { SqliteManager } from '../../infrastructure/database/sqlite-manager';
import { randomUUID } from 'crypto';

/**
 * Project Service
 * 业务逻辑层，处理项目的CRUD操作和服务器关联
 */
export class ProjectService {
  private repository: ProjectRepository | null = null;
  private dbManager: SqliteManager;

  constructor(dbManager: SqliteManager) {
    this.dbManager = dbManager;
  }

  /**
   * 获取Repository实例
   */
  private getRepository(): ProjectRepository {
    if (!this.repository) {
      const db = this.dbManager.getWorkspaceDatabase() || this.dbManager.getMainDatabase();
      this.repository = new ProjectRepository(db);
    }
    return this.repository;
  }

  /**
   * 获取所有项目
   */
  listProjects(): Project[] {
    const repo = this.getRepository();
    return repo.findAll();
  }

  /**
   * 根据ID获取项目
   */
  getProjectById(id: string): Project | null {
    const repo = this.getRepository();
    return repo.findById(id);
  }

  /**
   * 创建项目
   */
  createProject(data: { name: string; description?: string }): Project {
    const repo = this.getRepository();
    const now = Math.floor(Date.now() / 1000);

    const project: Project = {
      id: randomUUID(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };

    repo.create(project);
    return project;
  }

  /**
   * 更新项目
   */
  updateProject(id: string, updates: Partial<Project>): Project | null {
    const repo = this.getRepository();
    const existing = repo.findById(id);
    if (!existing) {
      return null;
    }

    const updated: Project = {
      ...existing,
      ...updates,
      id, // 确保ID不变
      updatedAt: Math.floor(Date.now() / 1000),
    };

    repo.update(id, updated);
    return repo.findById(id);
  }

  /**
   * 删除项目
   */
  deleteProject(id: string): boolean {
    const repo = this.getRepository();
    // 删除项目前，先删除所有服务器关联
    repo.removeAllServersFromProject(id);
    return repo.delete(id);
  }

  /**
   * 添加服务器到项目
   */
  addServerToProject(projectId: string, serverId: string): void {
    const repo = this.getRepository();
    repo.addServerToProject(projectId, serverId);
  }

  /**
   * 从项目移除服务器
   */
  removeServerFromProject(projectId: string, serverId: string): void {
    const repo = this.getRepository();
    repo.removeServerFromProject(projectId, serverId);
  }

  /**
   * 获取项目的服务器ID列表
   */
  getProjectServerIds(projectId: string): string[] {
    const repo = this.getRepository();
    return repo.getProjectServerIds(projectId);
  }

  /**
   * 获取项目的服务器数量
   */
  getProjectServerCount(projectId: string): number {
    const repo = this.getRepository();
    return repo.getProjectServerCount(projectId);
  }

  /**
   * 检查服务器是否属于项目
   */
  isServerInProject(projectId: string, serverId: string): boolean {
    const repo = this.getRepository();
    const serverIds = repo.getProjectServerIds(projectId);
    return serverIds.includes(serverId);
  }
}

