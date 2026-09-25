import { ref, computed } from 'vue'
import { api } from './useApi'

const token = ref(localStorage.getItem('token') || sessionStorage.getItem('token') || null)
const currentUser = ref(null)

try {
  const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
  if (savedUser) {
    currentUser.value = JSON.parse(savedUser)
  }
} catch (e) {
  console.error('Ошибка парсинга данных пользователя:', e)
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  function checkAuth() {
    if (token.value && !currentUser.value) {
      logout()
    }
  }

  async function login(username, password, rememberMe = false) {
    const response = await api.post('/login', { username, password })
    const { token: newToken, user } = response.data

    token.value = newToken
    currentUser.value = user

    if (rememberMe) {
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('token', newToken)
      sessionStorage.setItem('user', JSON.stringify(user))
    }

    return user
  }

  async function register(username, email, password) {
    const response = await api.post('/register', { username, email, password })
    const { token: newToken, user } = response.data

    token.value = newToken
    currentUser.value = user

    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('user', JSON.stringify(user))

    return user
  }

  function logout() {
    token.value = null
    currentUser.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
  }

  function updateCurrentUser(userData) {
    currentUser.value = userData

    if (localStorage.getItem('token')) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else if (sessionStorage.getItem('token')) {
      sessionStorage.setItem('user', JSON.stringify(userData))
    }
  }

  return {
    token,
    currentUser,
    isAuthenticated,
    checkAuth,
    login,
    register,
    logout,
    updateCurrentUser
  }
}