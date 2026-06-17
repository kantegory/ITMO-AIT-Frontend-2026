import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  const { get, post } = useApi()

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await get('/me')
    } catch {
      logout()
    }
  }

  async function login(payload) {
    const data = await post('/login', payload)
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function register(payload) {
    const data = await post('/register', payload)
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, isLoggedIn, fetchUser, login, register, logout }
})
