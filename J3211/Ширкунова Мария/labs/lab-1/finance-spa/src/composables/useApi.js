import { ref } from 'vue'
import api from '@/api/axios'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const request = async (method, url, payload = null) => {
    loading.value = true
    error.value = null
    try {
      const { data } = await api({ method, url, data: payload })
      return data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { loading, error, request }
}
