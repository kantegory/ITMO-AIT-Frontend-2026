import { customRef } from 'vue';

export function useDebouncedRef<T>(initial: T, delayMs = 300) {
  let timer: number | undefined;
  return customRef<T>((track, trigger) => {
    let value = initial;
    return {
      get() {
        track();
        return value;
      },
      set(next) {
        if (timer !== undefined) window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          value = next;
          trigger();
        }, delayMs);
      },
    };
  });
}
