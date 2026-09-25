import { ref } from 'vue'

export function useRequest(handler) {
  const isLoading = ref(false)
  const error = ref('')

  async function run(...args) {
    isLoading.value = true
    error.value = ''

    try {
      return await handler(...args)
    } catch (requestError) {
      error.value = requestError.response
        ? 'Не удалось загрузить данные. Проверьте, что сервер запущен.'
        : 'Сервер недоступен. Проверьте, что он запущен (npm run api).'

      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, run }
}
