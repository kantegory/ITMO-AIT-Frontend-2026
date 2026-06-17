import { ref, computed } from 'vue'

export default function useEventFilters() {
  const search = ref('')
  const typeFilter = ref('all')
  const cityFilter = ref('')

  const applyFilters = (events) => {
    if (!Array.isArray(events)) return []
    const searchValue = search.value.toLowerCase().trim()
    const cityValue = cityFilter.value.toLowerCase().trim()
    const typeValue = typeFilter.value

    return events.filter((event) => {
      const eventTitle = (event.title || '').toLowerCase()
      const eventCity = (event.city || event.cityLabel || '').toLowerCase()
      const eventType = event.type || ''
      const matchesSearch = !searchValue || eventTitle.includes(searchValue)
      const matchesType = typeValue === 'all' || eventType === typeValue
      const matchesCity = !cityValue || eventCity.includes(cityValue)
      return matchesSearch && matchesType && matchesCity
    })
  }

  const useFilteredEvents = (eventsRef) =>
    computed(() => applyFilters(eventsRef.value))

  const resetFilters = () => {
    search.value = ''
    typeFilter.value = 'all'
    cityFilter.value = ''
  }

  return { search, typeFilter, cityFilter, applyFilters, useFilteredEvents, resetFilters }
}
