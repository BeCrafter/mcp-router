/**
 * Platform API 类型定义
 * 定义Renderer Process可以调用的所有API接口
 */

// 通用响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Settings API
export interface SettingsAPI {
  get(): Promise<Record<string, unknown>>;
  save(settings: Record<string, unknown>): Promise<Record<string, unknown>>;
}

// Servers API
export interface ServersAPI {
  list(): Promise<unknown[]>;
  create(server: unknown): Promise<unknown>;
  update(id: string, updates: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
  toggle(id: string, enabled: boolean): Promise<boolean>;
}

// Workspaces API
export interface WorkspacesAPI {
  list(): Promise<unknown[]>;
  create(workspace: unknown): Promise<unknown>;
  switch(id: string): Promise<void>;
  update(id: string, updates: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
}

// Projects API
export interface ProjectsAPI {
  list(): Promise<unknown[]>;
  create(project: unknown): Promise<unknown>;
  update(id: string, updates: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
  addServer(projectId: string, serverId: string): Promise<void>;
  removeServer(projectId: string, serverId: string): Promise<void>;
}

// Apps API (客户端管理)
export interface AppsAPI {
  list(): Promise<unknown[]>;
  create(app: unknown): Promise<unknown>;
  generateToken(appId: string): Promise<string>;
  revokeToken(appId: string): Promise<void>;
}

// Logs API
export interface LogsAPI {
  query(options?: {
    startDate?: string;
    endDate?: string;
    serverId?: string;
    requestType?: string;
    status?: 'success' | 'error';
  }): Promise<unknown[]>;
  read(params: { date: string }): Promise<unknown[]>;
  cleanup(): Promise<boolean>;
}

// Workflows API
export interface WorkflowsAPI {
  list(): Promise<unknown[]>;
  get(id: string): Promise<unknown>;
  create(workflow: {
    name: string;
    description?: string;
    triggerType: 'tools/list' | 'tools/call' | 'manual';
    nodes?: any[];
    edges?: any[];
  }): Promise<unknown>;
  update(id: string, updates: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
  toggle(id: string, enabled: boolean): Promise<unknown>;
  execute(id: string, context?: Record<string, unknown>): Promise<unknown>;
}

// Clients API
export interface ClientsAPI {
  list(): Promise<unknown[]>;
  get(id: string): Promise<unknown>;
  create(client: { name: string; type: 'predefined' | 'custom' }): Promise<unknown>;
  update(id: string, updates: unknown): Promise<unknown>;
  delete(id: string): Promise<boolean>;
  generateToken(id: string): Promise<unknown>;
  revokeToken(id: string): Promise<unknown>;
}

// Packages API (预留)
export interface PackagesAPI {
  list(): Promise<unknown[]>;
}

// Auth API (预留)
export interface AuthAPI {
  // 预留接口
}

/**
 * Platform API 主接口
 * 包含所有API域
 */
export interface IPlatformAPI {
  settings: SettingsAPI;
  servers: ServersAPI;
  workspaces: WorkspacesAPI;
  projects: ProjectsAPI;
  apps: AppsAPI;
  logs: LogsAPI;
  workflows: WorkflowsAPI;
  clients: ClientsAPI;
  packages: PackagesAPI;
  auth: AuthAPI;
}

