import { ref, h, render, type Component } from 'vue';
import Toast from '../components/common/Toast.vue';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  message: string;
  type?: ToastType;
  title?: string;
  duration?: number;
  closable?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

const toasts = ref<Array<{ id: number; options: ToastOptions }>>([]);
let toastId = 0;

/**
 * Toast 管理器
 */
export function useToast() {
  const show = (options: ToastOptions) => {
    const id = toastId++;
    toasts.value.push({ id, options });
    
    // 自动移除
    if (options.duration !== 0) {
      setTimeout(() => {
        remove(id);
      }, options.duration || 3000);
    }
    
    return id;
  };

  const remove = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
    return show({ ...options, message, type: 'success' });
  };

  const error = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
    return show({ ...options, message, type: 'error', duration: 5000 });
  };

  const warning = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
    return show({ ...options, message, type: 'warning' });
  };

  const info = (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
    return show({ ...options, message, type: 'info' });
  };

  return {
    show,
    remove,
    success,
    error,
    warning,
    info,
    toasts,
  };
}

