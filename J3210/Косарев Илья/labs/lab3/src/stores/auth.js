import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('jwt_token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user_info') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  const displayName = computed(() => {
    if (!user.value) return 'Гость'
    const fullName = `${user.value?.firstName || ''} ${user.value?.lastName || ''}`.trim()
    return fullName || user.value?.username || 'Пользователь'
  })

  function saveAuthSession(newToken, newUser) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem('jwt_token', newToken)
    localStorage.setItem('user_info', JSON.stringify(newUser))
  }

  function clearAuthSession() {
    token.value = ''
    user.value = null
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_info')
  }

  async function login(email, password) {
    try {
      const response = await api.post('/login', { email, password })
      saveAuthSession(response.data.accessToken, response.data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data || 'Неверный email или пароль' }
    }
  }

  async function register(userData) {
    try {
      const response = await api.post('/register', userData)
      saveAuthSession(response.data.accessToken, response.data.user)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.response?.data || 'Ошибка при регистрации' }
    }
  }

  function logout() {
    clearAuthSession()
  }

  return {
    token,
    user,
    isAuthenticated,
    displayName,
    login,
    register,
    logout
  }
})