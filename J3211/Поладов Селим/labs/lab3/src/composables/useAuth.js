import { ref, computed } from 'vue'
import { api } from '../api/client.js'

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
const token = ref(localStorage.getItem('accessToken') || '')

function persist() {
  if (token.value) localStorage.setItem('accessToken', token.value)
  else localStorage.removeItem('accessToken')
  if (user.value) localStorage.setItem('user', JSON.stringify(user.value))
  else localStorage.removeItem('user')
}

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value)

  const fullName = computed(() => {
    const u = user.value || {}
    return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || ''
  })

  async function login(credentials) {
    const { data } = await api.post('/login', credentials)
    token.value = data.accessToken
    user.value = data.user
    persist()
  }

  async function register(payload) {
    const { data } = await api.post('/register', payload)
    token.value = data.accessToken
    user.value = data.user
    persist()
  }

  function logout() {
    token.value = ''
    user.value = null
    persist()
  }

  function setUser(updated) {
    user.value = updated
    persist()
  }

  return { user, token, isAuthenticated, fullName, login, register, logout, setUser }
}
