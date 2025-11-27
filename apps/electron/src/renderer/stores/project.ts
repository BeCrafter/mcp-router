import { defineStore } from 'pinia';
import type { Project } from '@mcp_router/shared/types';

/**
 * Project Store
 * 管理项目的状态
 */
export const useProjectStore = defineStore('project', {
  state: (): {
    projects: Project[];
    currentProject: Project | null;
    loading: boolean;
    error: string | null;
  } => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * 根据ID获取项目
     */
    getProjectById: (state) => (id: string) => {
      return state.projects.find((p) => p.id === id) || null;
    },
  },

  actions: {
    /**
     * 获取项目列表
     */
    async fetchProjects(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const projects = await window.platformAPI.projects.list();
        this.projects = projects as Project[];
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取项目列表失败';
        console.error('获取项目列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 创建项目
     */
    async createProject(data: { name: string; description?: string }): Promise<Project> {
      try {
        const project = await window.platformAPI.projects.create(data);
        this.projects.push(project);
        return project;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建项目失败';
        throw error;
      }
    },

    /**
     * 更新项目
     */
    async updateProject(id: string, updates: Partial<Project>): Promise<void> {
      try {
        const updated = await window.platformAPI.projects.update(id, updates);
        if (updated) {
          const index = this.projects.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.projects[index] = updated;
            if (this.currentProject?.id === id) {
              this.currentProject = updated;
            }
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新项目失败';
        throw error;
      }
    },

    /**
     * 删除项目
     */
    async deleteProject(id: string): Promise<void> {
      try {
        const success = await window.platformAPI.projects.delete(id);
        if (success) {
          this.projects = this.projects.filter((p) => p.id !== id);
          if (this.currentProject?.id === id) {
            this.currentProject = null;
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除项目失败';
        throw error;
      }
    },

    /**
     * 添加服务器到项目
     */
    async addServerToProject(projectId: string, serverId: string): Promise<void> {
      try {
        await window.platformAPI.projects.addServer(projectId, serverId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '添加服务器到项目失败';
        throw error;
      }
    },

    /**
     * 从项目移除服务器
     */
    async removeServerFromProject(projectId: string, serverId: string): Promise<void> {
      try {
        await window.platformAPI.projects.removeServer(projectId, serverId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : '从项目移除服务器失败';
        throw error;
      }
    },

    /**
     * 切换当前项目
     */
    switchProject(projectId: string | null): void {
      if (projectId === null) {
        this.currentProject = null;
        return;
      }
      const project = this.projects.find((p) => p.id === projectId);
      this.currentProject = project || null;
    },
  },
});

