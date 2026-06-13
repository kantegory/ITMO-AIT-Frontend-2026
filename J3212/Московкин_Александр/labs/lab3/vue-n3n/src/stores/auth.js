import { defineStore } from 'pinia'
import { getUsers, createUser, updateUser } from '@/api/users'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: (() => {
      try {
        const raw = localStorage.getItem('currentUser')
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()
  }),

  actions: {
    async login(email, password) {
      const { data } = await getUsers({ email, password })
      if (!data.length) throw new Error('Неверный email или пароль')
      this.currentUser = data[0]
      localStorage.setItem('currentUser', JSON.stringify(data[0]))
    },

    async register(name, email, password) {
      const { data: existing } = await getUsers({ email })
      if (existing.length) throw new Error('Пользователь с таким email уже существует')
      const { data: newUser } = await createUser({ name, email, password })
      this.currentUser = newUser
      localStorage.setItem('currentUser', JSON.stringify(newUser))
    },

    async updateProfile(fields) {
      const { data: updated } = await updateUser(this.currentUser.id, fields)
      this.currentUser = updated
      localStorage.setItem('currentUser', JSON.stringify(updated))
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('currentUser')
    }
  }
})