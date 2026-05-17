import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(credentials) {
      const result = await authApi.login(credentials)
      this.token = result.accessToken
      this.user = result.user
      localStorage.setItem('token', result.accessToken)
      localStorage.setItem('user', JSON.stringify(result.user))
      return result
    },
    
    async register(userData) {
      const result = await authApi.register(userData)
      this.token = result.accessToken
      this.user = result.user
      localStorage.setItem('token', result.accessToken)
      localStorage.setItem('user', JSON.stringify(result.user))
      return result
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  
  persist: {
    enabled: true,
    storage: localStorage,
    paths: ['token', 'user']
  }
})