import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isOrganizer: (state) => state.user?.role === 'organizer'
  },
  actions: {
    login(userData) {
      this.user = userData
    },
    logout() {
      this.user = null
    }
  },
  persist: true
})
