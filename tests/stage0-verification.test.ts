import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('阶段0验证', () => {
  it('项目结构应该完整', () => {
    expect(existsSync('package.json')).toBe(true);
    expect(existsSync('pnpm-workspace.yaml')).toBe(true);
    expect(existsSync('turbo.json')).toBe(true);
    expect(existsSync('packages')).toBe(true);
    expect(existsSync('apps')).toBe(true);
  });

  it('共享包应该存在', () => {
    expect(existsSync('packages/shared')).toBe(true);
    expect(existsSync('packages/shared/package.json')).toBe(true);
    expect(existsSync('packages/ui')).toBe(true);
    expect(existsSync('packages/tailwind-config')).toBe(true);
    expect(existsSync('packages/remote-api-types')).toBe(true);
  });

  it('Electron应用应该存在', () => {
    expect(existsSync('apps/electron')).toBe(true);
    expect(existsSync('apps/electron/package.json')).toBe(true);
    expect(existsSync('apps/electron/src/main/main.ts')).toBe(true);
    expect(existsSync('apps/electron/src/renderer/App.vue')).toBe(true);
  });

  it('CLI应用应该存在', () => {
    expect(existsSync('apps/cli')).toBe(true);
    expect(existsSync('apps/cli/package.json')).toBe(true);
    expect(existsSync('apps/cli/src/index.ts')).toBe(true);
  });
});

