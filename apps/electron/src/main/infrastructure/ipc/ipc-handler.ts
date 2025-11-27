import { ipcMain, IpcMainInvokeEvent } from 'electron';

/**
 * IPC Handler函数类型
 */
export type IpcHandler<T = unknown, R = unknown> = (
  event: IpcMainInvokeEvent,
  ...args: T[]
) => Promise<R> | R;

/**
 * IPC Handler注册器
 * 提供统一的IPC Handler注册和管理
 */
export class IpcHandlerRegistry {
  private handlers: Map<string, IpcHandler> = new Map();

  /**
   * 注册IPC Handler
   * @param channel IPC通道名称
   * @param handler 处理函数
   */
  register<T = unknown, R = unknown>(
    channel: string,
    handler: IpcHandler<T, R>
  ): void {
    // 移除已存在的handler（如果存在）
    if (this.handlers.has(channel)) {
      ipcMain.removeHandler(channel);
    }

    // 包装handler以添加错误处理
    const wrappedHandler = async (
      event: IpcMainInvokeEvent,
      ...args: T[]
    ): Promise<R> => {
      try {
        return await handler(event, ...args);
      } catch (error) {
        // 统一错误处理
        console.error(`IPC Handler错误 [${channel}]:`, error);
        throw error;
      }
    };

    // 注册到Electron
    ipcMain.handle(channel, wrappedHandler);
    this.handlers.set(channel, handler);
  }

  /**
   * 移除IPC Handler
   */
  unregister(channel: string): void {
    if (this.handlers.has(channel)) {
      ipcMain.removeHandler(channel);
      this.handlers.delete(channel);
    }
  }

  /**
   * 移除所有IPC Handler
   */
  unregisterAll(): void {
    for (const channel of this.handlers.keys()) {
      ipcMain.removeHandler(channel);
    }
    this.handlers.clear();
  }

  /**
   * 检查Handler是否已注册
   */
  has(channel: string): boolean {
    return this.handlers.has(channel);
  }
}

// 全局IPC Handler注册器实例
export const ipcHandlerRegistry = new IpcHandlerRegistry();

