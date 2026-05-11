import { computed, ref, watch } from 'vue'
import { TravelApi } from '@/api/travelApi.js'
import { useAuth } from './useAuth.js'
import { useDestinations } from './useDestinations.js'

const favorites = ref([])
const isLoading = ref(false)
let activeUserId = null

export function useFavorites() {
  const { currentUser } = useAuth()
  const { destinationsById } = useDestinations()

  async function loadFavorites(force = false) {
    const userId = currentUser.value?.id || null
    if (!force && userId === activeUserId && favorites.value.length) return favorites.value
    activeUserId = userId
    if (!userId) {
      favorites.value = []
      return favorites.value
    }
    isLoading.value = true
    try {
      const items = await TravelApi.getFavorites(userId)
      favorites.value = items
    } catch (error) {
      console.error('useFavorites: ошибка загрузки', error)
      favorites.value = []
    } finally {
      isLoading.value = false
    }
    return favorites.value
  }

  watch(
    () => currentUser.value?.id,
    () => {
      activeUserId = null
      loadFavorites(true)
    }
  )

  const favoriteIds = computed(() => favorites.value.map((entry) => Number(entry.destinationId)))

  const favoriteDestinations = computed(() =>
    favoriteIds.value
      .map((id) => destinationsById.value.get(id))
      .filter(Boolean)
  )

  function isFavorite(destinationId) {
    return favoriteIds.value.includes(Number(destinationId))
  }

  async function add(destinationId) {
    const userId = currentUser.value?.id
    if (!userId) return
    if (isFavorite(destinationId)) return
    const created = await TravelApi.addFavorite({ userId, destinationId: Number(destinationId) })
    favorites.value = [...favorites.value, created]
  }

  async function remove(destinationId) {
    const target = favorites.value.find((item) => Number(item.destinationId) === Number(destinationId))
    if (!target) return
    await TravelApi.deleteFavorite(target.id)
    favorites.value = favorites.value.filter((item) => item.id !== target.id)
  }

  return { favorites, favoriteDestinations, favoriteIds, isLoading, isFavorite, add, remove, loadFavorites }
}
