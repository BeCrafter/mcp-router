import { ipcMain } from 'electron';
import { LogService } from './log.service';
import type { LogEntry } from '@mcp_router/shared/types';

/**
 * 设置日志相关的IPC Handlers
 */
export function setupLogHandlers(logService: LogService): void {
  ipcMain.handle(
    'logs:query',
    async (
      _,
      options: {
        startDate?: string;
        endDate?: string;
        serverId?: string;
        requestType?: string;
        status?: 'success' | 'error';
      }
    ) => {
      return logService.queryLogs(options);
    }
  );

  ipcMain.handle('logs:read', async (_, { date }: { date: string }) => {
    return logService.readLogs(date);
  });

  ipcMain.handle('logs:cleanup', async () => {
    logService.cleanupOldLogs();
    return true;
  });
}

