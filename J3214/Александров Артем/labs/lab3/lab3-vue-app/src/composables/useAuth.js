import { ref } from 'vue'
import apiClient from '@/api/axios'

const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function useAuth() {
  const login = async (email, password) => {
    try {
      const response = await apiClient.get('/users')
      const users = Array.isArray(response.data) ? response.data : []

      const cleanEmail = email.trim().toLowerCase()
      const user = users.find(u => u?.email?.trim().toLowerCase() === cleanEmail)

      if (!user || user.password !== password) {
        throw new Error('Неверный email или пароль')
      }

      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))

      return user

    } catch (err) {
      if (err.message === 'Неверный email или пароль') throw err
      console.error('Ошибка входа:', err)

      throw new Error('Не удалось связаться с сервером')
    }
  }

  const register = async (userData) => {
    try {
      const registerResponse = await apiClient.get('/users')
      const users = Array.isArray(registerResponse.data) ? registerResponse.data : []

      const cleanEmail = userData.email.trim().toLowerCase()
      const existing = users.find(u => u?.email?.trim().toLowerCase() === cleanEmail)

      if (existing) {
        throw new Error('Пользователь с таким email уже существует')
      }

      // добавление id после распаковкти объекта (userData)
      const userToSave = {
        ...userData,
        id: String(Date.now())
      }

      const response = await apiClient.post('/users', userToSave)
      const user = response.data
      currentUser.value = user
      localStorage.setItem('currentUser', JSON.stringify(user))

      return user

    } catch (err) {
      if (err.message === 'Пользователь с таким email уже существует') throw err
      console.error('Ошибка регистрации:', err)
      throw new Error('Ошибка регистрации на сервере')
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  return {
    currentUser,
    login,
    register,
    logout
  }
}