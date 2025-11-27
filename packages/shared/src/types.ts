/**
 * 领域类型定义
 */

// Settings类型
export interface Settings {
  theme: 'light' | 'dark' | 'system';
  showWindowOnStartup: boolean;
  language: string;
  [key: string]: unknown;
}

// Workspace类型
export interface Workspace {
  id: string;
  name: string;
  type: 'local' | 'remote';
  lastUsedAt?: number;
  createdAt: number;
  config?: Record<string, unknown>;
}

// Server类型
export interface Server {
  id: string;
  name: string;
  enabled: boolean;
  transport: 'stdio' | 'http' | 'sse';
  config: ServerConfig;
  orderIndex: number;
  createdAt: number;
  updatedAt: number;
}

export interface ServerConfig {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

// Project类型
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

// IPC消息类型
export interface IpcRequest<T = unknown> {
  channel: string;
  args: T[];
}

export interface IpcResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Workflow类型
export type WorkflowNodeType = 'start' | 'end' | 'mcp-call' | 'hook';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  position: { x: number; y: number };
  data: {
    label?: string;
    [key: string]: unknown;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  triggerType: 'tools/list' | 'tools/call' | 'manual';
  enabled: boolean;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: number;
  updatedAt: number;
}

// Hook类型
export interface HookModule {
  id: string;
  name: string;
  description?: string;
  code: string;
  createdAt: number;
  updatedAt: number;
}

// Log类型
export interface LogEntry {
  id: string;
  timestamp: number;
  clientId?: string;
  requestType: string;
  params?: Record<string, unknown>;
  response?: Record<string, unknown>;
  duration?: number;
  status: 'success' | 'error';
  error?: string;
  serverId?: string;
  projectId?: string;
}

// Client类型
export interface Client {
  id: string;
  name: string;
  type: 'predefined' | 'custom';
  token?: string;
  createdAt: number;
  lastConnectedAt?: number;
}

