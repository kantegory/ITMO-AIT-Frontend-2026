import { ref } from 'vue'
const toasts = ref([])

export function useToast() {
  function showToast(msg, type = 'success') {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, msg, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  return { toasts, showToast }
}
