/**
 * 应用常量定义
 */

// HTTP服务器端口
export const HTTP_SERVER_PORT = 3282;

// 数据库文件名
export const MAIN_DATABASE_NAME = 'mcprouter.db';
export const WORKSPACE_DATABASE_PREFIX = 'workspace-';

// IPC通道前缀
export const IPC_CHANNEL_PREFIX = {
  SETTINGS: 'settings:',
  SERVERS: 'servers:',
  WORKSPACES: 'workspaces:',
  PROJECTS: 'projects:',
  APPS: 'apps:',
  LOGS: 'logs:',
  WORKFLOWS: 'workflows:',
  PACKAGES: 'packages:',
} as const;

// 日志保留天数
export const LOG_RETENTION_DAYS = 3;

// 默认设置
export const DEFAULT_SETTINGS = {
  theme: 'system' as const,
  showWindowOnStartup: true,
  language: 'zh',
} as const;

