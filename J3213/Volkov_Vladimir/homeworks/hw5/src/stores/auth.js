import { defineStore } from 'pinia'
import { usersApi } from '@/api'
import { SESSION_KEY, readJsonStorage, saveJsonStorage } from '@/utils'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: readJsonStorage(SESSION_KEY, null)
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.user),
    fullName: (state) =>
      state.user ? `${state.user.firstName ?? ''} ${state.user.lastName ?? ''}`.trim() : ''
  },
  actions: {
    setUser(user) {
      this.user = user
      saveJsonStorage(SESSION_KEY, user)
    },
    clearUser() {
      this.user = null
      localStorage.removeItem(SESSION_KEY)
    },
    async login({ email, password }) {
      const users = await usersApi.login(email, password)

      if (!users.length) {
        throw new Error('Неверный e-mail или пароль')
      }

      this.setUser(users[0])
      return users[0]
    },
    async register({ firstName, lastName, email, password }) {
      const exists = await usersApi.findByEmail(email)

      if (exists.length) {
        throw new Error('Пользователь с таким e-mail уже существует')
      }

      const createdUser = await usersApi.create({
        firstName,
        lastName,
        email,
        password
      })

      return createdUser
    },
    logout() {
      this.clearUser()
    }
  }
})
