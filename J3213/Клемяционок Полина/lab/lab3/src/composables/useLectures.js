import { ref } from 'vue'
import { useApi } from './useApi'

export function useLectures() {
  const { api } = useApi()
  const lectures = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetch(filter = 'all', search = '') {
    loading.value = true
    error.value = null
    try {
      let url = '/lectures'
      const params = []
      if (filter !== 'all') params.push(`category=${filter}`)
      if (search) params.push(`title_like=${search}`)
      if (params.length) url += '?' + params.join('&')

      const { data } = await api.get(url)
      lectures.value = data
    } catch (e) {
      error.value = 'Ошибка загрузки данных'
    } finally {
      loading.value = false
    }
  }

  return { lectures, loading, error, fetch }
}