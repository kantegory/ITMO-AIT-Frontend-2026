import { ref } from 'vue'
import { api } from './useApi'

export function useProfile() {
  const profile = ref(null)
  const profileStats = ref(null)
  const profileFics = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfile(username) {
    loading.value = true
    error.value = null

    try {
      const response = await api.get(`/profile/${username}`)
      profile.value = response.data.user
      profileStats.value = response.data.stats
      profileFics.value = response.data.fics
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка загрузки профиля'
      console.error('Ошибка загрузки профиля:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null

    try {
      const response = await api.put('/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      profile.value = response.data.user
      return { success: true, data: response.data }
    } catch (err) {
      error.value = err.response?.data?.error || 'Ошибка обновления профиля'
      console.error('Ошибка обновления профиля:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  async function checkSubscription(username) {
    try {
      const response = await api.get('/user/subscriptions')
      const subscriptions = response.data
      return subscriptions.includes(username)
    } catch (err) {
      console.error('Ошибка проверки подписки:', err)
      return false
    }
  }

  async function toggleSubscribe(username) {
    try {
      const response = await api.post(`/user/subscribe/${username}`)

      if (profileStats.value) {
        profileStats.value.subscribers = response.data.subscribersCount
      }

      return {
        success: true,
        subscribed: response.data.subscribed,
        subscribersCount: response.data.subscribersCount
      }
    } catch (err) {
      console.error('Ошибка подписки:', err)
      return {
        success: false,
        error: err.response?.data?.error || 'Ошибка при подписке'
      }
    }
  }

  async function fetchSubscriptions() {
    try {
      const response = await api.get('/user/subscriptions')
      return response.data
    } catch (err) {
      console.error('Ошибка загрузки подписок:', err)
      return []
    }
  }

  return {
    profile,
    profileStats,
    profileFics,
    loading,
    error,
    fetchProfile,
    updateProfile,
    checkSubscription,
    toggleSubscribe,
    fetchSubscriptions
  }
}