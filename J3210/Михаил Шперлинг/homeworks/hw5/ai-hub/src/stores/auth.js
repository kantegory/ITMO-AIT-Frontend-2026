import { defineStore } from 'pinia'
import { usersApi } from '@/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.user
  },

  actions: {
    // Восстанавливаем пользователя из localStorage при загрузке
    init() {
      try {
        const raw = localStorage.getItem('user')
        if (raw && raw !== 'undefined') {
          this.user = JSON.parse(raw)
        }
      } catch {
        localStorage.removeItem('user')
      }
    },

    async login(email, password) {
      const res = await usersApi.getByCredentials(email, password)
      if (res.data.length > 0) {
        this.user = res.data[0]
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      }
      return false
    },

    async register(username, email, password) {
      const res = await usersApi.create({ username, email, password })
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async updateProfile(id, data) {
      const res = await usersApi.update(id, data)
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
    }
  }
})
