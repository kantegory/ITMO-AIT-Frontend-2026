import { ref } from 'vue'
import api from '@/services/api'

export function useFetch() {
  const data = ref(null)
  const error = ref('')
  const isLoading = ref(false)

  const execute = async (url, config = {}) => {
    isLoading.value = true
    error.value = ''
    
    try {
      const response = await api.get(url, config)
      data.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Ошибка при загрузке данных.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, execute }
}