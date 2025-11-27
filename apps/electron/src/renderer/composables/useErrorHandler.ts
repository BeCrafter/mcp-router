import { useToast } from './useToast';

/**
 * 错误处理 Composable
 * 提供统一的错误处理逻辑
 */
export function useErrorHandler() {
  const toast = useToast();

  /**
   * 处理错误并显示用户友好的提示
   */
  const handleError = (error: unknown, context?: string): void => {
    console.error('[ErrorHandler]', context || '未知错误', error);

    let message = '操作失败';
    let type: 'error' | 'warning' = 'error';

    if (error instanceof Error) {
      // 检查是否是 AppError（通过检查是否有 code 和 toUserMessage 方法）
      if ('code' in error && 'toUserMessage' in error && typeof (error as any).toUserMessage === 'function') {
        message = (error as any).toUserMessage();
      } else {
        message = error.message || '操作失败';
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    toast.error(message, {
      title: context || '错误',
      duration: 5000,
    });
  };

  /**
   * 处理异步操作的错误
   */
  const handleAsyncError = async <T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      return await fn();
    } catch (error) {
      handleError(error, context);
      return null;
    }
  };

  return {
    handleError,
    handleAsyncError,
  };
}

