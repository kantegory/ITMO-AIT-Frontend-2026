import { defineStore } from 'pinia'
import { authApi } from '@/api'

const STORAGE_KEY = 'auth'

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {  }
  return null
}

function writeToStorage(value) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {  }
}

const stored = readFromStorage()

const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: stored?.accessToken || '',
    user: stored?.user || null
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken && state.user),
    isOrganizer: (state) => state.user?.role === 'organizer'
  },

  actions: {
    async login(credentials) {
      const response = await authApi.login(credentials)
      this.accessToken = response.data.accessToken
      this.user = response.data.user

      writeToStorage({ accessToken: this.accessToken, user: this.user })
      return response
    },

    async register(payload) {

      await authApi.register(payload)
      return this.login({ email: payload.email, password: payload.password })
    },

    logout() {
      this.accessToken = ''
      this.user = null
      writeToStorage(null)
    }
  }
})

export default useAuthStore
