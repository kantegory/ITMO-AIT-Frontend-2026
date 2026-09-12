import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useRouter } from 'vue-router'

export function useAuth() {
  const { api } = useApi()
  const router = useRouter()
  const user = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

  const isLoggedIn = computed(() => !!user.value)

  async function login(email, password, role) {
    const { data } = await api.get(`/users?email=${encodeURIComponent(email)}`)
    const found = data.find(u => u.password === password)
    if (found && found.role === role) {
      user.value = found
      localStorage.setItem('currentUser', JSON.stringify(found))
      return { success: true }
    }
    return { success: false, error: 'Неверный email, пароль или роль' }
  }

  async function register(data) {
    const { data: existing } = await api.get(`/users?email=${encodeURIComponent(data.email)}`)
    if (existing.length > 0) return { success: false, error: 'Email уже занят' }

    const res = await api.post('/users', data)
    user.value = res.data
    localStorage.setItem('currentUser', JSON.stringify(res.data))
    return { success: true }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  return { user, isLoggedIn, login, register, logout }
}