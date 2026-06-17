import { computed, onMounted, ref } from 'vue'
import { savedRoutesApi } from '../api/index.js'

export function useSavedRoutes() {
  const savedRoutes = ref([])
  const isLoading = ref(false)
  const message = ref('')
  const error = ref('')

  const savedRoutesCount = computed(() => savedRoutes.value.length)

  async function loadSavedRoutes() {
    isLoading.value = true
    error.value = ''

    try {
      const response = await savedRoutesApi.getAll()
      savedRoutes.value = Array.isArray(response.data) ? response.data : []
    } catch {
      savedRoutes.value = getLocalSavedRoutes()
      error.value = 'JSON Server недоступен, поэтому используются локальные данные.'
    } finally {
      isLoading.value = false
    }
  }

  function addSavedRoute(route) {
    const exists = savedRoutes.value.some((item) => item.key === route.key)

    if (exists) {
      message.value = 'Этот маршрут уже сохранён.'
      return
    }

    const newRoute = {
      id: Date.now(),
      ...route,
    }

    savedRoutes.value.push(newRoute)
    saveToLocalStorage()
    message.value = 'Маршрут сохранён.'
  }

  function removeSavedRoute(routeId) {
    savedRoutes.value = savedRoutes.value.filter((item) => item.id !== routeId)
    saveToLocalStorage()
    message.value = 'Маршрут удалён.'
  }

  function clearSavedRoutes() {
    savedRoutes.value = []
    saveToLocalStorage()
    message.value = 'Список сохранённых маршрутов очищен.'
  }

  function saveToLocalStorage() {
    localStorage.setItem('travel_saved_routes', JSON.stringify(savedRoutes.value))
  }

  onMounted(loadSavedRoutes)

  return {
    savedRoutes,
    savedRoutesCount,
    isLoading,
    message,
    error,
    loadSavedRoutes,
    addSavedRoute,
    removeSavedRoute,
    clearSavedRoutes,
  }
}

function getLocalSavedRoutes() {
  try {
    return JSON.parse(localStorage.getItem('travel_saved_routes')) || []
  } catch {
    return []
  }
}