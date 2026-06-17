import { ref } from 'vue'
import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:3001' })

const user = ref(null)
const loggedIn = ref(false)

export function useAuth() {
  async function login(email, password) {
    const { data } = await API.post('/login', { email, password })
    localStorage.setItem('token', data.token)
    user.value = data.user
    loggedIn.value = true
    return data
  }

  async function register(name, username, email, password) {
    const { data } = await API.post('/register', { name, username, email, password })
    localStorage.setItem('token', data.token)
    user.value = data.user
    loggedIn.value = true
    return data
  }

  async function logout() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await API.post('/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch {}
    }
    localStorage.removeItem('token')
    user.value = null
    loggedIn.value = false
  }

  async function checkSession() {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const { data } = await API.get('/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      user.value = data
      loggedIn.value = true
    } catch {
      localStorage.removeItem('token')
    }
  }

  return { user, loggedIn, login, register, logout, checkSession }
}
