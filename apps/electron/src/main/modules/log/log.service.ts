import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { LOG_RETENTION_DAYS } from '../../constants';
import type { LogEntry } from '@mcp_router/shared/types';
import { randomUUID } from 'crypto';

/**
 * Log Service
 * 管理请求日志的文件存储、读取和清理
 */
export class LogService {
  private logDir: string;
  private currentWorkspaceId: string | null = null;

  constructor(workspaceId: string | null = null) {
    this.currentWorkspaceId = workspaceId;
    const dataDir = app.getPath('userData');
    this.logDir = path.join(dataDir, 'logs');
    if (workspaceId) {
      this.logDir = path.join(this.logDir, `workspace-${workspaceId}`);
    }
    this.ensureLogDir();
  }

  /**
   * 确保日志目录存在
   */
  private ensureLogDir(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * 获取当日日志文件路径
   */
  private getTodayLogFile(): string {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return path.join(this.logDir, `request-logs-${today}.jsonl`);
  }

  /**
   * 获取指定日期的日志文件路径
   */
  private getLogFileForDate(date: string): string {
    return path.join(this.logDir, `request-logs-${date}.jsonl`);
  }

  /**
   * 写入日志条目
   */
  writeLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
    const logEntry: LogEntry = {
      id: randomUUID(),
      timestamp: Date.now(),
      ...entry,
    };

    const logFile = this.getTodayLogFile();
    const line = JSON.stringify(logEntry) + '\n';

    try {
      fs.appendFileSync(logFile, line, 'utf8');
    } catch (error) {
      console.error('[LogService] 写入日志失败:', error);
    }
  }

  /**
   * 读取指定日期的日志
   */
  readLogs(date: string): LogEntry[] {
    const logFile = this.getLogFileForDate(date);
    if (!fs.existsSync(logFile)) {
      return [];
    }

    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.trim().split('\n').filter((line) => line.trim());
      return lines.map((line) => JSON.parse(line) as LogEntry);
    } catch (error) {
      console.error('[LogService] 读取日志失败:', error);
      return [];
    }
  }

  /**
   * 查询日志（支持过滤）
   */
  queryLogs(options: {
    startDate?: string;
    endDate?: string;
    serverId?: string;
    requestType?: string;
    status?: 'success' | 'error';
  }): LogEntry[] {
    const startDate = options.startDate || this.getDateDaysAgo(LOG_RETENTION_DAYS);
    const endDate = options.endDate || new Date().toISOString().split('T')[0];

    const allLogs: LogEntry[] = [];
    const dates = this.getDateRange(startDate, endDate);

    for (const date of dates) {
      const logs = this.readLogs(date);
      allLogs.push(...logs);
    }

    // 应用过滤
    let filtered = allLogs;
    if (options.serverId) {
      filtered = filtered.filter((log) => log.serverId === options.serverId);
    }
    if (options.requestType) {
      filtered = filtered.filter((log) => log.requestType === options.requestType);
    }
    if (options.status) {
      filtered = filtered.filter((log) => log.status === options.status);
    }

    // 按时间戳排序
    return filtered.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * 清理超过保留期的日志文件
   */
  cleanupOldLogs(): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - LOG_RETENTION_DAYS);

    try {
      const files = fs.readdirSync(this.logDir);
      for (const file of files) {
        if (file.startsWith('request-logs-') && file.endsWith('.jsonl')) {
          const dateStr = file.replace('request-logs-', '').replace('.jsonl', '');
          const fileDate = new Date(dateStr);

          if (fileDate < cutoffDate) {
            const filePath = path.join(this.logDir, file);
            fs.unlinkSync(filePath);
            console.log(`[LogService] 删除旧日志文件: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('[LogService] 清理日志失败:', error);
    }
  }

  /**
   * 获取N天前的日期字符串
   */
  private getDateDaysAgo(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }

  /**
   * 获取日期范围内的所有日期
   */
  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    return dates;
  }

  /**
   * 切换工作区
   */
  switchWorkspace(workspaceId: string | null): void {
    this.currentWorkspaceId = workspaceId;
    const dataDir = app.getPath('userData');
    this.logDir = path.join(dataDir, 'logs');
    if (workspaceId) {
      this.logDir = path.join(this.logDir, `workspace-${workspaceId}`);
    }
    this.ensureLogDir();
  }
}

