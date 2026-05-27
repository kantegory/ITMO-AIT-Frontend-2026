import { ref } from 'vue'

const message = ref('')
const visible = ref(false)
let timer = null

export function useToast() {
  const showToast = (text) => {
    message.value = text
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 3000)
  }

  return { message, visible, showToast }
}
