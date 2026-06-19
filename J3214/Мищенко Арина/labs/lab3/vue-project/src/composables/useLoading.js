// Composable для управления состоянием загрузки.
// Устраняет дублирование loading/error в каждом компоненте.
import { ref } from 'vue'

export function useLoading() {
  const loading = ref(false)
  const error   = ref('')

  // Оборачивает async-функцию: ставит loading, ловит ошибки, сбрасывает через finally
  async function withLoading(fn) {
    loading.value = true
    error.value   = ''
    try {
      await fn()
    } catch (e) {
      error.value = e.message || 'Произошла ошибка'
    } finally {
      loading.value = false
    }
  }

  return { loading, error, withLoading }
}
