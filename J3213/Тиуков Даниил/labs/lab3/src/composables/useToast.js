import { reactive } from 'vue'

const state = reactive({ items: [] })

function generateId() {
  return `toast-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function useToast() {
  function showToast(message, type = 'info', delay = 2600) {
    const id = generateId()
    state.items.push({ id, message, type })
    setTimeout(() => removeToast(id), delay)
  }

  function removeToast(id) {
    const index = state.items.findIndex((toast) => toast.id === id)
    if (index >= 0) state.items.splice(index, 1)
  }

  return {
    toasts: state.items,
    showToast,
    removeToast
  }
}
