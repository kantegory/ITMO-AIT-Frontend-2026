import { ref } from 'vue'
import { defineStore } from 'pinia'
import { profilesApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

export const useProfileStore = defineStore('profile', () => {
  const auth = useAuthStore()

  const profile = ref(null)

  async function loadProfile() {
    const response = await profilesApi.getMy(auth.user.id)

    profile.value = response.data[0] || null
  }

  return { profile, loadProfile }
})
