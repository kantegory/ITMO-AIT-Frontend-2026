import { ref, computed } from 'vue'
import {
  DESTINATIONS, DEST_EXTRA, DEST_MAP,
  DEST_TIPS, DEST_REVIEWS, DEST_ATTRACTIONS,
} from '@/data/destinations'
const filters = ref({ type: 'all', query: '', maxBudget: 50000, sort: 'popular' })

export function useDestinations() {
  const filteredDestinations = computed(() => {
    let list = DESTINATIONS.filter(d => {
      const effectiveType = d.type === 'beach' ? 'nature' : d.type
      if (filters.value.type !== 'all' && effectiveType !== filters.value.type) return false
      if (filters.value.query) {
        const q = filters.value.query.toLowerCase()
        const searchable = [d.name, d.country, d.continent || '', ...d.tags]
        if (!searchable.some(x => x.toLowerCase().includes(q))) return false
      }
      if (d.priceNum > filters.value.maxBudget) return false
      return true
    })

    switch (filters.value.sort) {
      case 'price_asc':     return [...list].sort((a, b) => a.priceNum - b.priceNum)
      case 'price_desc':    return [...list].sort((a, b) => b.priceNum - a.priceNum)
      case 'rating':        return [...list].sort((a, b) => b.rating   - a.rating)
      case 'duration_asc':  return [...list].sort((a, b) => a.daysNum  - b.daysNum)
      case 'duration_desc': return [...list].sort((a, b) => b.daysNum  - a.daysNum)
      default:              return [...list].sort((a, b) => b.reviews  - a.reviews)
    }
  })

  function resetFilters() {
    filters.value = { type: 'all', query: '', maxBudget: 50000, sort: 'popular' }
  }

  function getDestination(id) {
    return DESTINATIONS.find(d => d.id === id) || DESTINATIONS[0]
  }

  return {
    filters,
    filteredDestinations,
    resetFilters,
    getDestination,
    DEST_EXTRA,
    DEST_MAP,
    DEST_TIPS,
    DEST_REVIEWS,
    DEST_ATTRACTIONS,
  }
}
