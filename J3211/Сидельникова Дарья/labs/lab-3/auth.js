import { defineStore } from 'pinia'
import { loginRequest, registerRequest } from '@/api/authApi'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email, password) {
      const user = await loginRequest(email, password)
      this.user = user
      this.token = 'fake-token'

      localStorage.setItem('currentUser', JSON.stringify(user))
      localStorage.setItem('token', 'fake-token')
    },

    async register(payload) {
      const newUser = await registerRequest(payload)
      this.user = newUser
      this.token = 'fake-token'

      localStorage.setItem('currentUser', JSON.stringify(newUser))
      localStorage.setItem('token', 'fake-token')
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('currentUser')
      localStorage.removeItem('token')
    }
  }
})