import {ref} from 'vue'

const toasts = ref([])
let toastIdCounter = 0

export function useToast() {
  function showToast(message, type = 'info') {
    const id = ++toastIdCounter

    const toast = {
      id,
      message,
      type,
      bgClass: {
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        warning: 'bg-warning text-dark',
        info: 'bg-primary text-white'
      }[type] || 'bg-primary text-white'
    }

    toasts.value.push(toast)

    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) toasts.value.splice(index, 1)
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
