import { ref, computed } from 'vue'
import { api } from './useApi'

export function useSearch() {
  const searchQuery = ref('')
  const allFics = ref([])
  const loading = ref(false)

  const filters = ref({
    title: '',
    fandom: '',
    rating: '',
    status: ''
  })

  const fandoms = [
    'Harry Potter',
    'Naruto',
    'Marvel',
    'Star Wars',
    'Lord of the Rings',
    'Оригинальный'
  ]

  const ratings = ['G', 'PG', 'PG-13', 'R']

  const statuses = [
    { value: 'completed', label: 'Закончен' },
    { value: 'in_progress', label: 'В процессе' }
  ]

  async function loadAllFics() {
    loading.value = true
    try {
      const response = await api.get('/fics')
      allFics.value = response.data
    } catch (err) {
      console.error('Ошибка загрузки:', err)
      allFics.value = []
    } finally {
      loading.value = false
    }
  }

  const filteredFics = computed(() => {
    let result = [...allFics.value]

    if (filters.value.title) {
      const titleLower = filters.value.title.toLowerCase()
      result = result.filter(fic =>
        fic.title.toLowerCase().includes(titleLower)
      )
    }

    if (filters.value.fandom) {
      result = result.filter(fic => fic.fandom === filters.value.fandom)
    }

    if (filters.value.rating) {
      result = result.filter(fic => fic.rating === filters.value.rating)
    }

    if (filters.value.status) {
      result = result.filter(fic => fic.status === filters.value.status)
    }

    return result
  })

  function resetFilters() {
    filters.value = {
      title: '',
      fandom: '',
      rating: '',
      status: ''
    }
  }

  function setSearchQuery(query) {
    searchQuery.value = query
    filters.value.title = query
  }

  return {
    searchQuery,
    allFics,
    loading,
    filters,
    fandoms,
    ratings,
    statuses,
    filteredFics,
    loadAllFics,
    resetFilters,
    setSearchQuery
  }
}