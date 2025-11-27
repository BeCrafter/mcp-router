import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Electron ipcRenderer
vi.mock('electron', () => ({
  ipcRenderer: {
    invoke: vi.fn(async (channel: string, ...args: unknown[]) => {
      // 返回空数据，仅验证API结构
      return {};
    }),
  },
}));

// 由于在Node环境中无法直接使用Electron的ipcRenderer，
// 这里主要验证API结构定义
describe('Platform API验证', () => {
  let ElectronPlatformAPI: any;

  beforeEach(async () => {
    const module = await import('../apps/electron/src/renderer/platform-api/electron-platform-api');
    ElectronPlatformAPI = module.ElectronPlatformAPI;
  });

  it('Platform API接口应该正确定义', () => {
    // 验证类型定义存在
    const api = new ElectronPlatformAPI();
    expect(api).toBeDefined();
  });

  it('应该包含所有必需的API域', () => {
    const api = new ElectronPlatformAPI();
    expect(api.settings).toBeDefined();
    expect(api.servers).toBeDefined();
    expect(api.workspaces).toBeDefined();
    expect(api.projects).toBeDefined();
    expect(api.apps).toBeDefined();
    expect(api.logs).toBeDefined();
    expect(api.workflows).toBeDefined();
    expect(api.packages).toBeDefined();
    expect(api.auth).toBeDefined();
  });

  it('Settings API应该有get和save方法', () => {
    const api = new ElectronPlatformAPI();
    expect(typeof api.settings.get).toBe('function');
    expect(typeof api.settings.save).toBe('function');
  });

  it('Servers API应该有所有CRUD方法', () => {
    const api = new ElectronPlatformAPI();
    expect(typeof api.servers.list).toBe('function');
    expect(typeof api.servers.create).toBe('function');
    expect(typeof api.servers.update).toBe('function');
    expect(typeof api.servers.delete).toBe('function');
    expect(typeof api.servers.toggle).toBe('function');
  });
});
