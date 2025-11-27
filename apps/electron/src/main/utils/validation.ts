/**
 * 验证工具函数
 */

/**
 * 验证ID格式
 */
export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && id.length > 0;
}

/**
 * 验证对象是否包含必需的字段
 */
export function hasRequiredFields<T extends Record<string, unknown>>(
  obj: unknown,
  requiredFields: (keyof T)[]
): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  for (const field of requiredFields) {
    if (!(field in obj)) {
      return false;
    }
  }

  return true;
}

/**
 * 验证字符串非空
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

