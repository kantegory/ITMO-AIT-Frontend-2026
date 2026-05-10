import { ref } from 'vue'

const toasts = ref([])
let nextId = 1

export function useToast() {
  const showToast = (message, type = 'info', delay = 2500) => {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }, delay)
  }

  const dismissToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  return { toasts, showToast, dismissToast }
}
