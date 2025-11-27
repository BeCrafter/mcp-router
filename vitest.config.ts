import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './apps/electron/src'),
      '@mcp_router/shared': resolve(__dirname, './packages/shared/src'),
    },
  },
});

