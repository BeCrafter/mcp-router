import { ref, type Ref } from 'vue';

/**
 * 缓存项接口
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * 缓存管理器
 * 提供简单的内存缓存功能，用于减少IPC调用
 */
export function useCache<T>(ttl: number = 5000) {
  const cache = ref<Map<string, CacheItem<T>>>(new Map());

  /**
   * 获取缓存数据
   */
  const get = (key: string): T | null => {
    const item = cache.value.get(key);
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() > item.expiresAt) {
      cache.value.delete(key);
      return null;
    }

    return item.data;
  };

  /**
   * 设置缓存数据
   */
  const set = (key: string, data: T): void => {
    cache.value.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    });
  };

  /**
   * 删除缓存
   */
  const remove = (key: string): void => {
    cache.value.delete(key);
  };

  /**
   * 清空所有缓存
   */
  const clear = (): void => {
    cache.value.clear();
  };

  /**
   * 清理过期缓存
   */
  const cleanup = (): void => {
    const now = Date.now();
    for (const [key, item] of cache.value.entries()) {
      if (now > item.expiresAt) {
        cache.value.delete(key);
      }
    }
  };

  /**
   * 检查缓存是否存在且有效
   */
  const has = (key: string): boolean => {
    const item = cache.value.get(key);
    if (!item) {
      return false;
    }
    if (Date.now() > item.expiresAt) {
      cache.value.delete(key);
      return false;
    }
    return true;
  };

  return {
    get,
    set,
    remove,
    clear,
    cleanup,
    has,
  };
}

