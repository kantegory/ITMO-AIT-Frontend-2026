import { ref } from 'vue'

export function useAsyncAction() {
  const loading = ref(false)
  const error   = ref('')

  async function execute(fn) {
    error.value   = ''
    loading.value = true
    try {
      return await fn()
    } catch (e) {
      error.value = e.response?.data?.error || e.message || 'Произошла ошибка'
      throw e
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = ''
  }

  return { loading, error, execute, clearError }
}
