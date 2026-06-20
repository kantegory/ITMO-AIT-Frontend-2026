import { ref, watch } from 'vue'
import { TravelApi } from '@/api/travelApi.js'
import { useAuth } from './useAuth.js'

const routes = ref([])
const isLoading = ref(false)
let activeUserId = null

export function useRoutes() {
  const { currentUser } = useAuth()

  async function loadRoutes(force = false) {
    const userId = currentUser.value?.id || null
    if (!force && userId === activeUserId && routes.value.length) return routes.value
    activeUserId = userId
    if (!userId) {
      routes.value = []
      return routes.value
    }
    isLoading.value = true
    try {
      routes.value = await TravelApi.getRoutes(userId)
    } catch (error) {
      console.error('useRoutes: ошибка загрузки', error)
      routes.value = []
    } finally {
      isLoading.value = false
    }
    return routes.value
  }

  watch(
    () => currentUser.value?.id,
    () => {
      activeUserId = null
      loadRoutes(true)
    }
  )

  async function addRoute(payload) {
    const userId = currentUser.value?.id
    if (!userId) return null
    const created = await TravelApi.addRoute({
      userId,
      destinationId: payload.destinationId ? Number(payload.destinationId) : null,
      ...payload
    })
    routes.value = [...routes.value, created]
    return created
  }

  async function removeRoute(routeId) {
    await TravelApi.deleteRoute(routeId)
    routes.value = routes.value.filter((route) => route.id !== routeId)
  }

  async function attachDestination(routeId, destination) {
    const target = routes.value.find((route) => route.id === routeId)
    if (!target) return
    const updated = await TravelApi.updateRoute(routeId, {
      destinationId: destination.id,
      description: `${target.description} • Добавлено направление: ${destination.name}`
    })
    routes.value = routes.value.map((route) => (route.id === routeId ? updated : route))
  }

  return { routes, isLoading, addRoute, removeRoute, attachDestination, loadRoutes }
}
