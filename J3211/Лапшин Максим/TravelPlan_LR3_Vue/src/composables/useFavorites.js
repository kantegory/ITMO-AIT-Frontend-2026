import { computed, ref } from 'vue'

const STORAGE_KEY = 'travelPlanFavorites'
const favoriteIds = ref(readFavorites())

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function useFavorites() {
  function toggleFavorite(id) {
    favoriteIds.value = favoriteIds.value.includes(id)
      ? favoriteIds.value.filter((item) => item !== id)
      : [...favoriteIds.value, id]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  }

  function isFavorite(id) {
    return favoriteIds.value.includes(id)
  }

  const count = computed(() => favoriteIds.value.length)

  return { favoriteIds, count, toggleFavorite, isFavorite }
}
