import { ref } from 'vue'

const notification = ref(null)
let timeout = null

export function useNotification() {
  const showNotification = (message, isError = false) => {
    if (timeout) clearTimeout(timeout)
    
    notification.value = { message, isError }
    
    timeout = setTimeout(() => {
      notification.value = null
    }, 4000)
  }

  const hideNotification = () => {
    if (timeout) clearTimeout(timeout)
    notification.value = null
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}