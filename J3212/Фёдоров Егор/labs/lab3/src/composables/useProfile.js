import { ref } from 'vue'
import { profileApi, publicationsApi } from '@/services/api'

export function useProfile() {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const publicationError = ref(null)

  async function loadProfile() {
    loading.value = true
    error.value = null
    try {
      profile.value = await profileApi.summary()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPublication(publication) {
    publicationError.value = null
    try {
      await publicationsApi.create(publication)
      await loadProfile()
    } catch (err) {
      publicationError.value = err.message
      throw err
    }
  }

  return {
    profile,
    loading,
    error,
    publicationError,
    loadProfile,
    createPublication,
  }
}
