import { computed, onMounted, reactive, ref } from 'vue'
import { getFilters, getTours } from '@/services/api'

const emptyOptions = { types: [], priceRanges: [], durations: [] }

export function useTours() {
  const tours = ref([])
  const filterOptions = ref(emptyOptions)
  const loading = ref(false)
  const error = ref('')
  const filters = reactive({ search: '', type: 'all', budget: 'all', duration: '' })

  const filteredTours = computed(() => tours.value.filter((tour) => {
    const query = filters.search.trim().toLowerCase()
    const priceRange = filterOptions.value.priceRanges.find((range) => range.id === filters.budget)
    return (!query || tour.title.toLowerCase().includes(query) || tour.description.toLowerCase().includes(query))
      && (filters.type === 'all' || tour.type === filters.type)
      && (!filters.duration || tour.duration === Number(filters.duration))
      && (!priceRange || (tour.price >= priceRange.min && tour.price <= priceRange.max))
  }))

  async function loadData() {
    loading.value = true
    error.value = ''
    try {
      const [tourData, optionData] = await Promise.all([getTours(), getFilters()])
      tours.value = tourData
      filterOptions.value = optionData
    } catch {
      error.value = 'Не удалось получить туры. Проверьте, запущен ли API на порту 3001.'
    } finally {
      loading.value = false
    }
  }

  function resetFilters() {
    Object.assign(filters, { search: '', type: 'all', budget: 'all', duration: '' })
  }

  onMounted(loadData)

  return { tours, filteredTours, filterOptions, filters, loading, error, loadData, resetFilters }
}
