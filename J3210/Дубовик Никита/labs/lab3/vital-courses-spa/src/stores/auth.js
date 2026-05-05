import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getUserByEmail } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isTeacher: (state) => state.user?.role === 'teacher',
    fullName: (state) =>
      state.user ? `${state.user.firstName} ${state.user.lastName}` : ''
  },

  actions: {
    async login(email, password) {
      const { accessToken, user } = await apiLogin(email, password)
      this.token = accessToken
      this.user = user
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    },

    async register(userData) {
      const { accessToken, user } = await apiRegister(userData)
      this.token = accessToken
      this.user = user
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      window.location.href = '/'
    },

    async refreshUser() {
      if (!this.user?.email) return
      const freshUser = await getUserByEmail(this.user.email)
      if (freshUser) {
        this.user = { ...freshUser, password: undefined }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  },

  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['token', 'user']
  }
})
