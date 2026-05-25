import { ref } from 'vue'
import instance from '../api/instance'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)

export function useAuth() {
  const error = ref('')

  const login = async (email) => {
    error.value = ''

    try {
      const response = await instance.get('/users', {
        params: {
          email,
        },
      })

      const foundUser = response.data[0]

      if (!foundUser) {
        error.value = 'Пользователь не найден'
        return null
      }

      user.value = foundUser
      localStorage.setItem('user', JSON.stringify(foundUser))

      return foundUser
    } catch (err) {
      error.value = 'Ошибка подключения к серверу'
      console.error(err)
      return null
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    error,
    login,
    logout,
  }
}