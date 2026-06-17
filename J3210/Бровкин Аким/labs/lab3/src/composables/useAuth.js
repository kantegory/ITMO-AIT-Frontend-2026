import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_URL = 'http://localhost:3000'
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null)

export function useAuth() {
  const router = useRouter()

  const login = async (email, password) => {
    const { data } = await axios.get(`${API_URL}/users?email=${email}&password=${password}`)
    if (data.length > 0) {
      currentUser.value = data[0]
      localStorage.setItem('user', JSON.stringify(data[0]))
      router.push('/dashboard')
    } else {
      alert('Неверный email или пароль!')
    }
  }

  const register = async (fullName, email, password) => {
    const { data: existing } = await axios.get(`${API_URL}/users?email=${email}`)
    if (existing.length > 0) {
      alert('Пользователь с таким email уже существует!')
      return
    }
    const newUser = { fullName, email, password, myCourses: [] }
    await axios.post(`${API_URL}/users`, newUser)
    await login(email, password)
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('user')
    router.push('/')
  }

  return { currentUser, login, register, logout }
}
