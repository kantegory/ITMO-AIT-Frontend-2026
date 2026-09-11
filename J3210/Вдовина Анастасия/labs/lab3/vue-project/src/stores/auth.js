import { defineStore } from 'pinia'
import { authApi } from '@/api'

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'),
    accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
    isOrganizer: (state) => state.user?.role === 'organizer',
  },
  actions: {
    saveSession({ accessToken, user }, remember = true) {
      this.accessToken = accessToken
      this.user = user

      // без «запомнить меня» сессия живёт до закрытия вкладки
      const storage = remember ? localStorage : sessionStorage

      storage.setItem('accessToken', accessToken)
      storage.setItem('user', JSON.stringify(user))
    },
    async login(data, remember = true) {
      const response = await authApi.login(data)

      this.saveSession(response.data, remember)

      return response
    },
    async updateUser(data) {
      const response = await authApi.updateUser(this.user.id, data)

      this.user = { ...this.user, ...data }

      const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage

      storage.setItem('user', JSON.stringify(this.user))

      return response
    },
    async register(data) {
      const response = await authApi.register(data)

      this.saveSession(response.data)

      return response
    },
    logout() {
      this.accessToken = ''
      this.user = null

      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      sessionStorage.removeItem('accessToken')
      sessionStorage.removeItem('user')
    },
  },
})

export default useAuthStore
