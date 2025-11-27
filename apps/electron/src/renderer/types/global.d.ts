import type { IPlatformAPI } from '@mcp_router/shared/platform-api';

declare global {
  interface Window {
    platformAPI: IPlatformAPI;
  }
}

export {};

