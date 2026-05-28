import { ref } from 'vue'

export function useApi(request) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref('')

  const execute = async (...args) => {
    loading.value = true
    error.value = ''
    try {
      const response = await request(...args)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || err.message || 'Ошибка загрузки данных'
      throw err
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
