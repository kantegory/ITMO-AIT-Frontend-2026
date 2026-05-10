import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { useApi } from '@/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  const { get, post } = useApi()

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await get<User>('/me')
    } catch {
      logout()
    }
  }

  async function login(payload: LoginPayload) {
    const data = await post<{ token: string; user: User }>('/login', payload)
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function register(payload: RegisterPayload) {
    const data = await post<{ token: string; user: User }>('/register', payload)
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
