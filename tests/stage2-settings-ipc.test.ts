import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setupSettingsHandlers } from '../apps/electron/src/main/modules/settings/settings.ipc';
import { SqliteManager } from '../apps/electron/src/main/infrastructure/database/sqlite-manager';
import { SchemaManager } from '../apps/electron/src/main/infrastructure/database/schema-manager';
import { ipcHandlerRegistry } from '../apps/electron/src/main/infrastructure/ipc';

// Mock Electron ipcMain
const mockHandlers = new Map<string, any>();
vi.mock('electron', () => {
  const mockHandlers = new Map<string, any>();
  return {
    app: {
      getPath: () => './test-data',
    },
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
      listeners: vi.fn((channel: string) => {
        return mockHandlers.has(channel) ? [mockHandlers.get(channel)] : [];
      }),
    },
  };
});

describe('Settings IPC验证', () => {
  let dbManager: SqliteManager;

  beforeEach(async () => {
    const electron = await import('electron');
    dbManager = new SqliteManager('./test-data');
    const schemaManager = new SchemaManager(dbManager);
    schemaManager.migrate();
    setupSettingsHandlers(dbManager);
  });

  it('应该可以调用settings:get', async () => {
    const electron = await import('electron');
    const handler = electron.ipcMain.listeners('settings:get')[0] as any;
    expect(handler).toBeDefined();

    const result = await handler(null);
    expect(result).toBeDefined();
    expect(result.theme).toBeDefined();
    expect(result.showWindowOnStartup).toBeDefined();
  });

  it('应该可以调用settings:save', async () => {
    const electron = await import('electron');
    const handler = electron.ipcMain.listeners('settings:save')[0] as any;
    expect(handler).toBeDefined();

    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'en',
    };

    const result = await handler(null, newSettings);
    expect(result).toBeDefined();
    expect(result.theme).toBe('dark');
    expect(result.showWindowOnStartup).toBe(false);
  });
});

