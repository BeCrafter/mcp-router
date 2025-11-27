// 基础类型定义
export type ID = string;

// 通用响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// 通用分页类型
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 导出Platform API类型
export * from './platform-api';

// 导出领域类型
export * from './types';

// 导出MCP协议类型
export * from './mcp-types';

