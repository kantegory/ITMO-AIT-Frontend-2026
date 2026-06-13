import { ref } from 'vue'
import api from '../api/axios'

const currentUser = ref(
  JSON.parse(localStorage.getItem('currentUser') || 'null')
)

export function useAuth() {
  async function login(email, password) {
    const response = await api.get('/users', { params: { email } })
    const users = response.data
    const user = users[0]

    if (!user || user.password !== password) {
      throw new Error('Неверный email или пароль')
    }

    currentUser.value = user
    localStorage.setItem('currentUser', JSON.stringify(user))
    return user
  }

  async function register(name, email, password) {
    const existing = await api.get('/users', { params: { email } })

    if (existing.data.length > 0) {
      throw new Error('Пользователь уже существует')
    }

    const response = await api.post('/users', { name, email, password })
    currentUser.value = response.data
    localStorage.setItem('currentUser', JSON.stringify(response.data))
    return response.data
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    currentUser,
    login,
    register,
    logout,
  }
}