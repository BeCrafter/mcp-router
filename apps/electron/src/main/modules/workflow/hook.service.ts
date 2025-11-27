import { randomUUID } from 'crypto';
import { createContext, runInContext } from 'vm';
import Database from 'better-sqlite3';
import { HookRepository } from './hook.repository';
import type { HookModule } from '@mcp_router/shared/types';

/**
 * Hook Service
 * 业务逻辑层，处理Hook模块的CRUD操作和执行
 */
export class HookService {
  private repository: HookRepository;

  constructor(db: Database.Database) {
    this.repository = new HookRepository(db);
  }

  /**
   * 获取所有Hook模块
   */
  listHooks(): HookModule[] {
    return this.repository.findAll();
  }

  /**
   * 根据ID获取Hook模块
   */
  getHookById(id: string): HookModule | null {
    return this.repository.findById(id);
  }

  /**
   * 创建新Hook模块
   */
  createHook(input: { name: string; description?: string; code: string }): HookModule {
    const now = Math.floor(Date.now() / 1000);
    const hook: HookModule = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      code: input.code,
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(hook);
  }

  /**
   * 更新Hook模块
   */
  updateHook(id: string, updates: Partial<HookModule>): HookModule | null {
    return this.repository.update(id, updates);
  }

  /**
   * 删除Hook模块
   */
  deleteHook(id: string): boolean {
    return this.repository.delete(id);
  }

  /**
   * 验证Hook代码
   */
  validateHookCode(code: string): { valid: boolean; error?: string } {
    try {
      // 尝试编译代码
      new Function(code);
      return { valid: true };
    } catch (error: any) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * 在安全沙箱中执行Hook代码
   * 注意：当前使用Node.js内置vm模块，安全性较低
   * TODO: 后续应使用vm2或isolated-vm提供更好的安全性
   */
  executeHook(code: string, context: Record<string, unknown>): unknown {
    try {
      // 创建沙箱上下文
      const sandbox = {
        ...context,
        // 提供一些安全的工具函数
        console: {
          log: (...args: unknown[]) => console.log('[Hook]', ...args),
        },
        // 限制访问
        require: undefined,
        process: undefined,
        global: undefined,
      };

      const vmContext = createContext(sandbox);
      const script = new Function('context', `with(context) { ${code} }`);
      const result = script(vmContext);
      return result;
    } catch (error: any) {
      console.error('[HookService] 执行Hook失败:', error);
      throw new Error(`Hook执行失败: ${error.message}`);
    }
  }
}

