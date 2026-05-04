import { ref } from 'vue'
import api from '../api/api'

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)

export function useAuth() {
  const login = async (email, password) => {
    const response = await api.get('/users', {
      params: { email, password }
    })

    const user = response.data[0]

    if (!user) {
      throw new Error('Неверный email или пароль')
    }

    currentUser.value = user
    localStorage.setItem('user', JSON.stringify(user))

    return user
  }

  const register = async (name, email, password) => {
    const response = await api.post('/users', {
      name,
      email,
      password
    })

    currentUser.value = response.data
    localStorage.setItem('user', JSON.stringify(response.data))

    return response.data
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
  }

  return {
    currentUser,
    login,
    register,
    logout
  }
}