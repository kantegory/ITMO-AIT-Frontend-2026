import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(localStorage.getItem('accessToken'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function setSession(data) {
    accessToken.value = data.accessToken
    user.value = data.user

    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  async function login(data) {
    const response = await authApi.login(data)

    setSession(response.data)
  }

  async function register(data) {
    const response = await authApi.register(data)

    setSession(response.data)
  }

  function logout() {
    accessToken.value = null
    user.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return { accessToken, user, isAuthenticated, login, register, logout }
})
