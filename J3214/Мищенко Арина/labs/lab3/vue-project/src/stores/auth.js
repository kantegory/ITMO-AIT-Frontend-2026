// Хранилище авторизации - persist:true сохраняет в localStorage
import { defineStore } from 'pinia'
import { authApi }     from '@/api'

const useAuthStore = defineStore('auth', {
  persist: true,

  state: () => ({
    user:  null,   // объект текущего пользователя
    error: ''
  }),

  getters: {
    isLoggedIn: (s) => s.user !== null,
    isTeacher:  (s) => s.user?.role === 'teacher'
  },

  actions: {
    // ищем по email, проверяем password и role на клиенте
    async login(email, password, role) {
      this.error = ''
      try {
        const res   = await authApi.findByEmail(email)
        const users = res.data
        const found = users.find(u => u.password === password && u.role === role)
        if (!found) { this.error = 'Неверный email или пароль'; return false }
        this.user = found
        return true
      } catch { this.error = 'Не удалось подключиться к серверу'; return false }
    },

    // проверяем email, создаём пользователя
    async register(firstName, lastName, email, password, role) {
      this.error = ''
      try {
        const check = await authApi.findByEmail(email)
        if (check.data.length > 0) { this.error = 'Пользователь с таким email уже существует'; return false }
        const res  = await authApi.register({ firstName, lastName, email, password, role })
        this.user  = res.data
        return true
      } catch { this.error = 'Не удалось подключиться к серверу'; return false }
    },

    async updateProfile(userId, firstName, lastName) {
      const res = await authApi.update(userId, { firstName, lastName })
      if (this.user) {
        this.user.firstName = firstName
        this.user.lastName  = lastName
      }
    },

    logout() { this.user = null; this.error = '' }
  }
})

export default useAuthStore
