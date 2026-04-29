import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)

export function useAuth() {
  const router = useRouter()
  const API_URL = 'http://localhost:3000'

  const login = async (email, password) => {
    try {
      const { data } = await axios.get(`${API_URL}/users?email=${email}`)
      
      if (data.length > 0 && data[0].password === password) {
        currentUser.value = data[0]
        localStorage.setItem('user', JSON.stringify(data[0]))
        router.push('/profile')
        return { success: true }
      }
      return { success: false, error: 'Неверный email или пароль!' }
    } catch (error) {
      return { success: false, error: 'Ошибка сервера. Проверьте json-server.' }
    }
  }

  const register = async (email, password) => {
    try {
      const { data: existingUsers } = await axios.get(`${API_URL}/users?email=${email}`)
      
      if (existingUsers.length > 0) {
        return { success: false, error: 'Пользователь с таким Email уже существует!' }
      }

      const { data: newUser } = await axios.post(`${API_URL}/users`, { email, password })
      currentUser.value = newUser
      localStorage.setItem('user', JSON.stringify(newUser))
      router.push('/profile')
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Ошибка сервера. Проверьте json-server.' }
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    currentUser,
    login,
    register,
    logout
  }
}