import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('learnify_token') || '',
    user: JSON.parse(localStorage.getItem('learnify_user') || 'null')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.user?.name || 'Пользователь',
    userRole: (state) => state.user?.role || ''
  },

  actions: {
    async login({ email, password }) {
      const data = await authApi.login({ email, password })
      if (data.accessToken) {
        this.token = data.accessToken
        localStorage.setItem('learnify_token', data.accessToken)
      }
      if (data.user) {
        const { password: _, ...safeUser } = data.user
        this.user = safeUser
        localStorage.setItem('learnify_user', JSON.stringify(safeUser))
      }
      return data
    },

    async register({ name, email, password, role }) {
      const data = await authApi.register({ name, email, password, role })
      if (data.accessToken) {
        this.token = data.accessToken
        localStorage.setItem('learnify_token', data.accessToken)
      }
      if (data.user) {
        const { password: _, ...safeUser } = data.user
        this.user = safeUser
        localStorage.setItem('learnify_user', JSON.stringify(safeUser))
      }
      return data
    },

    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem('learnify_token')
      localStorage.removeItem('learnify_user')
    },

    init() {
      this.token = localStorage.getItem('learnify_token') || ''
      try {
        this.user = JSON.parse(localStorage.getItem('learnify_user') || 'null')
      } catch {
        this.user = null
      }
    }
  },

  persist: {
    pick: ['token', 'user']
  }
})