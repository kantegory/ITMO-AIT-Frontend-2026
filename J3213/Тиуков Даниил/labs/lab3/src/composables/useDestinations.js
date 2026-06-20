import { computed, ref } from 'vue'
import { TravelApi } from '@/api/travelApi.js'

export const labelMaps = {
  type: { city: 'Город', nature: 'Природа', mixed: 'Смешанный' },
  budget: { low: 'Низкий', medium: 'Средний', high: 'Высокий' }
}

const destinations = ref([])
const isLoaded = ref(false)
const isLoading = ref(false)
const error = ref(null)
let activePromise = null

export function useDestinations() {
  async function loadDestinations(force = false) {
    if (!force && isLoaded.value) return destinations.value
    if (activePromise) return activePromise

    isLoading.value = true
    error.value = null
    activePromise = TravelApi.getDestinations()
      .then((items) => {
        destinations.value = items
        isLoaded.value = true
        return items
      })
      .catch((err) => {
        error.value = err?.message || 'Не удалось загрузить направления.'
        return []
      })
      .finally(() => {
        isLoading.value = false
        activePromise = null
      })

    return activePromise
  }

  async function getDestination(id) {
    const numericId = Number(id)
    if (destinations.value.length) {
      const found = destinations.value.find((dest) => Number(dest.id) === numericId)
      if (found) return found
    }
    return TravelApi.getDestination(numericId).catch(() => null)
  }

  const destinationsById = computed(() => {
    const map = new Map()
    destinations.value.forEach((dest) => map.set(Number(dest.id), dest))
    return map
  })

  return { destinations, destinationsById, isLoading, isLoaded, error, loadDestinations, getDestination, labelMaps }
}
