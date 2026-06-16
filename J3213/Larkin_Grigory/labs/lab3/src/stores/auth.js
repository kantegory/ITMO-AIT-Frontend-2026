import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const userId = ref(localStorage.getItem('userId') || null)

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password) {
    const { data: users } = await api.get('/users', { params: { email } })
    const user = users.find(u => u.password === password)
    if (!user) throw new Error('Неверный email или пароль')
    const t = btoa(user.id + ':' + Date.now())
    token.value = t
    userId.value = String(user.id)
    localStorage.setItem('token', t)
    localStorage.setItem('userId', user.id)
  }

  async function register(name, email, password) {
    const { data: existing } = await api.get('/users', { params: { email } })
    if (existing.length > 0) throw new Error('Пользователь с таким email уже существует')
    const { data: user } = await api.post('/users', { name, email, password })
    const t = btoa(user.id + ':' + Date.now())
    token.value = t
    userId.value = String(user.id)
    localStorage.setItem('token', t)
    localStorage.setItem('userId', user.id)
  }

  function logout() {
    token.value = null
    userId.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  return { token, userId, isLoggedIn, login, register, logout }
})
