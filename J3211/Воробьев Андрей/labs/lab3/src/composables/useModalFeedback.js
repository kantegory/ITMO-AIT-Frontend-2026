import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'

export function useModalFeedback() {
  const modalStore = useModalStore()
  const router = useRouter()

  function showError(error) {
    const message = error?.message || 'Произошла ошибка.'
    modalStore.openInfo('Ошибка', message)
  }

  function showInfo(title, message) {
    modalStore.openInfo(title, message)
  }

  function showInfoAndRedirect(title, message, routeName, delay = 900) {
    modalStore.openInfo(title, message)
    setTimeout(() => {
      router.push({ name: routeName })
      modalStore.close()
    }, delay)
  }

  return {
    showError,
    showInfo,
    showInfoAndRedirect
  }
}
