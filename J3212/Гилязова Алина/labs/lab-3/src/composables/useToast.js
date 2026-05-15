import { ref } from 'vue'

const toastState = ref({
  visible: false,
  title: 'Уведомление',
  message: '',

  token: 0
})

export default function useToast() {
  const showToast = (message, title = 'Уведомление') => {
    toastState.value = {
      visible: true,
      title,
      message,
      token: toastState.value.token + 1
    }
  }

  const hideToast = () => {
    toastState.value = { ...toastState.value, visible: false }
  }

  return { toastState, showToast, hideToast }
}
