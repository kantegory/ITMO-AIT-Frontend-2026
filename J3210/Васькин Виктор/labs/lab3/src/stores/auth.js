import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const login = (userData, accessToken) => {
    user.value = userData
    token.value = accessToken
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return { user, token, login, logout }
}, {
  persist: true 
})