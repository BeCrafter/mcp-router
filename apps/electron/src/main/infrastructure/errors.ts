/**
 * Platform API错误类型
 */
export class PlatformAPIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'PlatformAPIError';
  }
}

/**
 * 数据库错误
 */
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * IPC错误
 */
export class IpcError extends Error {
  constructor(message: string, public channel?: string) {
    super(message);
    this.name = 'IpcError';
  }
}

