import { computed, ref } from 'vue'
import apiClient from '../api/client'
const storedUser = localStorage.getItem('user')
const user = ref(storedUser ? JSON.parse(storedUser) : null)
const token = ref(localStorage.getItem('accessToken'))
function saveAuth(auth) {
  token.value = auth.accessToken
  user.value = auth.user
  localStorage.setItem('accessToken', auth.accessToken)
  localStorage.setItem('user', JSON.stringify(auth.user))
  localStorage.setItem('userType', auth.user.role || 'user')
}
function clearAuth() {
  token.value = null
  user.value = null
  localStorage.removeItem('accessToken')
  localStorage.removeItem('user')
  localStorage.removeItem('userType')
}
export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const userRole = computed(() => user.value?.role || '')
  async function login(email, password, selectedRole) {
    const { data } = await apiClient.post('/login', { email, password })
    if (selectedRole && selectedRole !== data.user.role) {
      const actualLabel = data.user.role === 'organizer' ? 'организатор' : 'пользователь'
      const selectedLabel = selectedRole === 'organizer' ? 'организатор' : 'пользователь'
      throw new Error(`Вы зарегистрированы как ${actualLabel}, но выбрали вход как ${selectedLabel}. Пожалуйста, выберите правильную роль.`)
    }
    saveAuth(data)
    return data.user
  }
  async function register(payload) {
    await apiClient.post('/signup', payload)
    const { data } = await apiClient.post('/login', {
      email: payload.email,
      password: payload.password
    })
    saveAuth(data)
    return data.user
  }
  function logout() {
    clearAuth()
  }
  return {
    user,
    token,
    isAuthenticated,
    userRole,
    login,
    register,
    logout
  }
}
