import { ref } from 'vue'

export function useApiState() {
  const loading = ref(false)
  const error = ref('')

  async function run(callback) {
    loading.value = true
    error.value = ''

    try {
      return await callback()
    } catch (err) {
      console.error(err)
      error.value = err?.message || 'Произошла ошибка при работе с API'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    run,
  }
}
