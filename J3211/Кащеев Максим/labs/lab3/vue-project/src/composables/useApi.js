import { ref } from 'vue'

export function useApi(apiFn) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function execute(...args) {
    loading.value = true
    error.value = null
    try {
      const response = await apiFn(...args)
      data.value = response.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, execute }
}
