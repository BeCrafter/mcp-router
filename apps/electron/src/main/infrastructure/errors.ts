/**
 * 统一错误类型定义
 */

export enum ErrorCode {
  // 数据库错误 (1000-1999)
  DATABASE_CONNECTION_ERROR = 1000,
  DATABASE_QUERY_ERROR = 1001,
  DATABASE_TRANSACTION_ERROR = 1002,
  
  // 服务器错误 (2000-2999)
  SERVER_NOT_FOUND = 2000,
  SERVER_CONNECTION_ERROR = 2001,
  SERVER_CONFIG_ERROR = 2002,
  
  // 工作区错误 (3000-3999)
  WORKSPACE_NOT_FOUND = 3000,
  WORKSPACE_ALREADY_EXISTS = 3001,
  WORKSPACE_SWITCH_ERROR = 3002,
  
  // 项目错误 (4000-4999)
  PROJECT_NOT_FOUND = 4000,
  PROJECT_ALREADY_EXISTS = 4001,
  
  // 工作流错误 (5000-5999)
  WORKFLOW_NOT_FOUND = 5000,
  WORKFLOW_EXECUTION_ERROR = 5001,
  WORKFLOW_VALIDATION_ERROR = 5002,
  
  // Hook错误 (6000-6999)
  HOOK_NOT_FOUND = 6000,
  HOOK_EXECUTION_ERROR = 6001,
  HOOK_VALIDATION_ERROR = 6002,
  
  // 客户端错误 (7000-7999)
  CLIENT_NOT_FOUND = 7000,
  CLIENT_TOKEN_INVALID = 7001,
  
  // 日志错误 (8000-8999)
  LOG_READ_ERROR = 8000,
  LOG_WRITE_ERROR = 8001,
  
  // 通用错误 (9000-9999)
  VALIDATION_ERROR = 9000,
  UNAUTHORIZED = 9001,
  INTERNAL_ERROR = 9999,
}

/**
 * 应用错误基类
 */
export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * 转换为用户友好的错误消息
   */
  toUserMessage(): string {
    const messages: Record<ErrorCode, string> = {
      [ErrorCode.DATABASE_CONNECTION_ERROR]: '数据库连接失败',
      [ErrorCode.DATABASE_QUERY_ERROR]: '数据库查询失败',
      [ErrorCode.DATABASE_TRANSACTION_ERROR]: '数据库事务失败',
      [ErrorCode.SERVER_NOT_FOUND]: '服务器不存在',
      [ErrorCode.SERVER_CONNECTION_ERROR]: '服务器连接失败',
      [ErrorCode.SERVER_CONFIG_ERROR]: '服务器配置错误',
      [ErrorCode.WORKSPACE_NOT_FOUND]: '工作区不存在',
      [ErrorCode.WORKSPACE_ALREADY_EXISTS]: '工作区已存在',
      [ErrorCode.WORKSPACE_SWITCH_ERROR]: '切换工作区失败',
      [ErrorCode.PROJECT_NOT_FOUND]: '项目不存在',
      [ErrorCode.PROJECT_ALREADY_EXISTS]: '项目已存在',
      [ErrorCode.WORKFLOW_NOT_FOUND]: '工作流不存在',
      [ErrorCode.WORKFLOW_EXECUTION_ERROR]: '工作流执行失败',
      [ErrorCode.WORKFLOW_VALIDATION_ERROR]: '工作流验证失败',
      [ErrorCode.HOOK_NOT_FOUND]: 'Hook模块不存在',
      [ErrorCode.HOOK_EXECUTION_ERROR]: 'Hook执行失败',
      [ErrorCode.HOOK_VALIDATION_ERROR]: 'Hook验证失败',
      [ErrorCode.CLIENT_NOT_FOUND]: '客户端不存在',
      [ErrorCode.CLIENT_TOKEN_INVALID]: '客户端Token无效',
      [ErrorCode.LOG_READ_ERROR]: '读取日志失败',
      [ErrorCode.LOG_WRITE_ERROR]: '写入日志失败',
      [ErrorCode.VALIDATION_ERROR]: '数据验证失败',
      [ErrorCode.UNAUTHORIZED]: '未授权访问',
      [ErrorCode.INTERNAL_ERROR]: '内部错误',
    };
    
    return messages[this.code] || '未知错误';
  }

  /**
   * 转换为JSON格式
   */
  toJSON(): Record<string, unknown> {
    return {
      code: this.code,
      message: this.message,
      userMessage: this.toUserMessage(),
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * 错误处理工具函数
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(ErrorCode.INTERNAL_ERROR, error.message, {
      originalError: error.name,
      stack: error.stack,
    });
  }
  
  return new AppError(
    ErrorCode.INTERNAL_ERROR,
    '未知错误',
    { originalError: String(error) }
  );
}

/**
 * 错误日志记录
 */
export function logError(error: AppError, context?: Record<string, unknown>): void {
  console.error('[AppError]', {
    code: error.code,
    message: error.message,
    userMessage: error.toUserMessage(),
    details: error.details,
    context,
    stack: error.stack,
  });
}
