import { defineStore } from 'pinia'
import { authApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:  null,
    token: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    async login(email, password) {
      const res = await authApi.login(email, password)
      this.token = res.data.token
      this.user  = res.data.user
      localStorage.setItem('mlpipe_token', res.data.token)
      return res.data.user
    },

    async register(name, email, password, role) {
      const res = await authApi.register(name, email, password, role)
      this.token = res.data.token
      this.user  = res.data.user
      localStorage.setItem('mlpipe_token', res.data.token)
      return res.data.user
    },

    async logout() {
      try { await authApi.logout() } catch (_) {}
      this.token = null
      this.user  = null
      localStorage.removeItem('mlpipe_token')
    }
  },

  persist: true
})
