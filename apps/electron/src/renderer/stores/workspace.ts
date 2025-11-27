import { defineStore } from 'pinia';
import type { Workspace } from '@mcp_router/shared/types';

/**
 * Workspace Store
 * 管理工作区的状态
 */
export const useWorkspaceStore = defineStore('workspace', {
  state: (): {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    loading: boolean;
    error: string | null;
  } => ({
    workspaces: [],
    currentWorkspace: null,
    loading: false,
    error: null,
  }),

  getters: {
    /**
     * 获取本地工作区
     */
    localWorkspaces(): Workspace[] {
      return this.workspaces.filter((w) => w.type === 'local');
    },

    /**
     * 获取远程工作区
     */
    remoteWorkspaces(): Workspace[] {
      return this.workspaces.filter((w) => w.type === 'remote');
    },
  },

  actions: {
    /**
     * 获取工作区列表
     */
    async fetchWorkspaces(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const workspaces = await window.platformAPI.workspaces.list();
        this.workspaces = workspaces as Workspace[];
        
        // 设置当前工作区（第一个或最近使用的）
        if (this.workspaces.length > 0 && !this.currentWorkspace) {
          this.currentWorkspace = this.workspaces[0];
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取工作区列表失败';
        console.error('获取工作区列表失败:', error);
      } finally {
        this.loading = false;
      }
    },

    /**
     * 创建工作区
     */
    async createWorkspace(name: string): Promise<Workspace> {
      try {
        const workspace = await window.platformAPI.workspaces.create({ name });
        this.workspaces.push(workspace);
        return workspace;
      } catch (error) {
        this.error = error instanceof Error ? error.message : '创建工作区失败';
        throw error;
      }
    },

    /**
     * 切换工作区
     */
    async switchWorkspace(id: string): Promise<void> {
      try {
        await window.platformAPI.workspaces.switch(id);
        const workspace = this.workspaces.find((w) => w.id === id);
        if (workspace) {
          this.currentWorkspace = workspace;
        }
        
        // 刷新所有数据（服务器、项目等）
        // TODO: 触发其他Store刷新
      } catch (error) {
        this.error = error instanceof Error ? error.message : '切换工作区失败';
        throw error;
      }
    },

    /**
     * 更新工作区
     */
    async updateWorkspace(id: string, updates: Partial<Workspace>): Promise<void> {
      try {
        const updated = await window.platformAPI.workspaces.update(id, updates);
        if (updated) {
          const index = this.workspaces.findIndex((w) => w.id === id);
          if (index !== -1) {
            this.workspaces[index] = updated;
            if (this.currentWorkspace?.id === id) {
              this.currentWorkspace = updated;
            }
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新工作区失败';
        throw error;
      }
    },

    /**
     * 删除工作区
     */
    async deleteWorkspace(id: string): Promise<void> {
      try {
        const success = await window.platformAPI.workspaces.delete(id);
        if (success) {
          this.workspaces = this.workspaces.filter((w) => w.id !== id);
          if (this.currentWorkspace?.id === id) {
            this.currentWorkspace = this.workspaces[0] || null;
            if (this.currentWorkspace) {
              await this.switchWorkspace(this.currentWorkspace.id);
            }
          }
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '删除工作区失败';
        throw error;
      }
    },
  },
});

