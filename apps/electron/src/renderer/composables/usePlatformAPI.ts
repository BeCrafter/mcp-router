import { inject } from 'vue';
import type { ElectronPlatformAPI } from '../platform-api/electron-platform-api';

/**
 * 获取 Platform API 实例
 */
export function usePlatformAPI(): ElectronPlatformAPI {
  const api = inject<ElectronPlatformAPI>('platformAPI');
  if (!api) {
    throw new Error('PlatformAPI not provided');
  }
  return api;
}

