import { useUiStore } from '@/stores/ui'

export function useToast() {
  const uiStore = useUiStore()

  function showToast(message) {
    uiStore.showToast(message)
  }

  return {
    showToast,
    hideToast: uiStore.hideToast
  }
}
