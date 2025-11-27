import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { WorkflowService } from './workflow.service';
import type { WorkflowDefinition } from '@mcp_router/shared/types';

/**
 * 设置工作流相关的IPC Handlers
 */
export function setupWorkflowHandlers(db: Database.Database): WorkflowService {
  const service = new WorkflowService(db);

  ipcMain.handle('workflows:list', async () => {
    return service.listWorkflows();
  });

  ipcMain.handle('workflows:get', async (_, { id }: { id: string }) => {
    return service.getWorkflowById(id);
  });

  ipcMain.handle(
    'workflows:create',
    async (
      _,
      input: {
        name: string;
        description?: string;
        triggerType: 'tools/list' | 'tools/call' | 'manual';
        nodes?: any[];
        edges?: any[];
      }
    ) => {
      return service.createWorkflow(input);
    }
  );

  ipcMain.handle(
    'workflows:update',
    async (_, { id, updates }: { id: string; updates: Partial<WorkflowDefinition> }) => {
      return service.updateWorkflow(id, updates);
    }
  );

  ipcMain.handle('workflows:delete', async (_, { id }: { id: string }) => {
    return service.deleteWorkflow(id);
  });

  ipcMain.handle(
    'workflows:toggle',
    async (_, { id, enabled }: { id: string; enabled: boolean }) => {
      return service.toggleWorkflow(id, enabled);
    }
  );

  ipcMain.handle(
    'workflows:execute',
    async (_, { id, context }: { id: string; context?: Record<string, unknown> }) => {
      return service.executeWorkflow(id, context || {});
    }
  );

  return service;
}

