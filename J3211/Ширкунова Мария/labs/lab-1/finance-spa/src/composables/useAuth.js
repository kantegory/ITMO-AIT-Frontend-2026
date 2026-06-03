import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref(localStorage.getItem('accessToken') || null)

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = () => !!token.value

  const setSession = (data) => {
    token.value = data.accessToken
    user.value = data.user
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
  }

  const login = async (payload) => {
    const { data } = await api.post('/login', payload)
    setSession(data)
    router.push('/')
  }

  const register = async (payload) => {
    const { data } = await api.post('/register', payload)
    setSession(data)
    router.push('/')
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.clear()
    router.push('/login')
  }

  return { user, token, isAuthenticated, login, register, logout }
}
