import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IpcHandlerRegistry } from '../apps/electron/src/main/infrastructure/ipc/ipc-handler';

// Mock Electron ipcMain
const mockHandlers = new Map<string, any>();
const mockIpcMain = {
  handle: vi.fn((channel: string, handler: any) => {
    mockHandlers.set(channel, handler);
  }),
  removeHandler: vi.fn((channel: string) => {
    mockHandlers.delete(channel);
  }),
  removeAllListeners: vi.fn(() => {
    mockHandlers.clear();
  }),
  listenerCount: vi.fn((channel: string) => {
    return mockHandlers.has(channel) ? 1 : 0;
  }),
  listeners: vi.fn((channel: string) => {
    return mockHandlers.has(channel) ? [mockHandlers.get(channel)] : [];
  }),
};

vi.mock('electron', () => {
  const mockHandlers = new Map<string, any>();
  return {
    ipcMain: {
      handle: vi.fn((channel: string, handler: any) => {
        mockHandlers.set(channel, handler);
      }),
      removeHandler: vi.fn((channel: string) => {
        mockHandlers.delete(channel);
      }),
      removeAllListeners: vi.fn(() => {
        mockHandlers.clear();
      }),
      listenerCount: vi.fn((channel: string) => {
        return mockHandlers.has(channel) ? 1 : 0;
      }),
      listeners: vi.fn((channel: string) => {
        return mockHandlers.has(channel) ? [mockHandlers.get(channel)] : [];
      }),
    },
  };
});

describe('IPC通信验证', () => {
  let registry: IpcHandlerRegistry;
  let ipcMain: any;

  beforeEach(async () => {
    const electron = await import('electron');
    ipcMain = electron.ipcMain;
    (ipcMain.removeAllListeners as any)();
    registry = new IpcHandlerRegistry();
  });

  it('应该可以注册IPC Handler', () => {
    registry.register('test:ping', async () => 'pong');
    expect(registry.has('test:ping')).toBe(true);
    expect(ipcMain.handle).toHaveBeenCalledWith('test:ping', expect.any(Function));
  });

  it('应该可以调用IPC Handler', async () => {
    let capturedHandler: any;
    (ipcMain.handle as any).mockImplementation((channel: string, handler: any) => {
      if (channel === 'test:echo') {
        capturedHandler = handler;
      }
    });

    registry.register('test:echo', async (_, message: string) => message);

    expect(capturedHandler).toBeDefined();
    const result = await capturedHandler(null, 'hello');
    expect(result).toBe('hello');
  });

  it('应该可以移除IPC Handler', () => {
    registry.register('test:ping', async () => 'pong');
    expect(registry.has('test:ping')).toBe(true);

    registry.unregister('test:ping');
    expect(registry.has('test:ping')).toBe(false);
    expect(ipcMain.removeHandler).toHaveBeenCalledWith('test:ping');
  });

  it('应该可以移除所有IPC Handler', () => {
    registry.register('test:ping', async () => 'pong');
    registry.register('test:pong', async () => 'ping');

    registry.unregisterAll();
    expect(registry.has('test:ping')).toBe(false);
    expect(registry.has('test:pong')).toBe(false);
  });
});

