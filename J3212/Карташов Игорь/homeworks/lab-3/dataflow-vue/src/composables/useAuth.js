import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '../api'

const userId = ref(localStorage.getItem('userId'))

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => Boolean(userId.value))

  function setSession(id) {
    userId.value = String(id)
    localStorage.setItem('userId', userId.value)
  }

  function clearSession() {
    userId.value = null
    localStorage.removeItem('userId')
  }

  function logout() {
    clearSession()
    router.push({ name: 'login' })
  }

  async function login(email, password) {
    const users = await usersApi.findByEmail(email.trim())
    if (users.length === 0 || users[0].password !== password) {
      throw new Error('Invalid email or password')
    }
    setSession(users[0].id)
    return users[0]
  }

  async function register(form) {
    if (form.password !== form.confirmPassword) {
      throw new Error('Passwords do not match')
    }

    const existing = await usersApi.findByEmail(form.email.trim())
    if (existing.length > 0) {
      throw new Error('User with this email already exists')
    }

    const user = await usersApi.create({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      password: form.password,
      role: 'Viewer',
      team: '',
      timezone: '',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    })

    setSession(user.id)
    return user
  }

  return {
    userId: computed(() => (userId.value ? parseInt(userId.value, 10) : null)),
    isAuthenticated,
    login,
    register,
    logout,
  }
}
