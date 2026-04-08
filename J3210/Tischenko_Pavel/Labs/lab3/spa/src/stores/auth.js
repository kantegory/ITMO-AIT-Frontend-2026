import { defineStore } from 'pinia'
import { authApi } from '../api'

const TOKEN_KEY = 'lab3-token'
const USER_KEY = 'lab3-user'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: '',
    role: '',
    loading: false,
    error: ''
  }),
  actions: {
    restoreSession() {
      const token = localStorage.getItem(TOKEN_KEY)
      const userRaw = localStorage.getItem(USER_KEY)
      if (!token || !userRaw) return
      try {
        const user = JSON.parse(userRaw)
        this.user = user
        this.role = user?.role || ''
        this.token = token
      } catch {
        this.logout()
      }
    },
    async login(payload) {
      this.loading = true
      this.error = ''
      try {
        const response = await authApi.login(payload)
        this.token = response.data?.token || ''
        this.user = response.data?.user || null
        this.role = this.user?.role || ''
        localStorage.setItem(TOKEN_KEY, this.token)
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
        return response
      } catch (error) {
        this.error = error?.response?.data?.message || 'Ошибка входа.'
        throw error
      } finally {
        this.loading = false
      }
    },
    async register(payload) {
      this.loading = true
      this.error = ''
      try {
        const response = await authApi.register(payload)
        this.token = response.data?.token || ''
        this.user = response.data?.user || null
        this.role = this.user?.role || ''
        localStorage.setItem(TOKEN_KEY, this.token)
        localStorage.setItem(USER_KEY, JSON.stringify(this.user))
        return response
      } catch (error) {
        this.error = error?.response?.data?.message || 'Ошибка регистрации.'
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = ''
      this.role = ''
      this.error = ''
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    }
  }
})

export default useAuthStore
