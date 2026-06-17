import { ref } from 'vue'
import { favoritesApi } from '@/services/api'
import { useAuth } from './useAuth'

export function useFavorites() {
  const favoriteLoading = ref(false)
  const favoriteError = ref(null)
  const { isLoggedIn } = useAuth()

  async function checkFavorite(resourceType, resourceKey) {
    if (!isLoggedIn.value) return false
    const response = await favoritesApi.check(resourceType, resourceKey)
    return response.active
  }

  async function toggleFavorite(item) {
    if (!isLoggedIn.value) {
      throw new Error('Для работы с избранным нужно войти.')
    }

    const subtitle = item.resourceType === 'model'
      ? item.pipelineTag
      : item.taskCategories?.[0] || 'Dataset'

    favoriteLoading.value = true
    favoriteError.value = null

    try {
      return await favoritesApi.toggle({
        resourceType: item.resourceType,
        resourceKey: item.id,
        title: item.title,
        author: item.author,
        subtitle,
        source: item.source || 'huggingface',
      })
    } catch (error) {
      favoriteError.value = error.message
      throw error
    } finally {
      favoriteLoading.value = false
    }
  }

  return {
    favoriteLoading,
    favoriteError,
    checkFavorite,
    toggleFavorite,
  }
}
