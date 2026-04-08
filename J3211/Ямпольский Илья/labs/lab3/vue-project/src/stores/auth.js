import { defineStore } from 'pinia'
import { usersApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isOrganizer: (state) => state.user?.email === 'sergo0_1337228007zzz@mail.ru'
  },
  actions: {
    async login(credentials) {
      const response = await usersApi.login(credentials)
      this.accessToken = response.data.accessToken
      this.user = response.data.user
      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    async register(userData) {
      const response = await usersApi.register(userData)
      this.accessToken = response.data.accessToken
      this.user = response.data.user
      localStorage.setItem('accessToken', this.accessToken)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      const theme = localStorage.getItem('theme')
      localStorage.clear()
      if (theme) localStorage.setItem('theme', theme)
      this.accessToken = null
      this.user = null
    },
    loadFromStorage() {
      const token = localStorage.getItem('accessToken')
      const user = localStorage.getItem('user')
      if (token && user) {
        this.accessToken = token
        this.user = JSON.parse(user)
      }
    }
  }
})
