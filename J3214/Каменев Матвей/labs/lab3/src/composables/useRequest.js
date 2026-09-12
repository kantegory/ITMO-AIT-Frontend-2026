import { ref } from 'vue'

const useRequest = (request, { immediate = false } = {}) => {
  const loading = ref(false)
  const error = ref(null)

  async function run(...args) {
    loading.value = true
    error.value = null

    try {
      await request(...args)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  if (immediate) {
    run()
  }

  return { loading, error, run }
}

export default useRequest
