import { readonly, ref } from 'vue';

const toasts = ref([]);

export function useToast() {
  function showToast(message, variant = 'success') {
    const id = crypto.randomUUID();
    toasts.value.push({ id, message, variant });
    window.setTimeout(() => removeToast(id), 3500);
  }

  function removeToast(id) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast
  };
}
