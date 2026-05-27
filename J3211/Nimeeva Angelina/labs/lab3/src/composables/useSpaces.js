import { ref } from 'vue'
import axios from 'axios'

const API_BASE = 'http://localhost:3000'

export function useSpaces() {
  const spaces = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSpaces = async () => {
    loading.value = true
    error.value = null
    try {
      const { data } = await axios.get(`${API_BASE}/spaces`)
      spaces.value = data
    } catch {
      error.value = 'Не удалось загрузить список помещений.'
    } finally {
      loading.value = false
    }
  }

  return { spaces, loading, error, fetchSpaces }
}
