import { computed, ref } from 'vue'
import { authApi } from '@/services/api'

const token = ref(localStorage.getItem('mh_token'))
const user = ref(readUserFromStorage())
const authError = ref(null)
const authLoading = ref(false)

function readUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('mh_user') || 'null')
  } catch {
    return null
  }
}

function saveSession(newToken, newUser) {
  token.value = newToken
  user.value = newUser
  localStorage.setItem('mh_token', newToken)
  localStorage.setItem('mh_user', JSON.stringify(newUser))
}

function clearSession() {
  token.value = null
  user.value = null
  localStorage.removeItem('mh_token')
  localStorage.removeItem('mh_user')
}

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(email, password) {
    authLoading.value = true
    authError.value = null
    try {
      const response = await authApi.login(email, password)
      saveSession(response.token, response.user)
      return response.user
    } catch (error) {
      authError.value = error.message
      throw error
    } finally {
      authLoading.value = false
    }
  }

  async function register(form) {
    authLoading.value = true
    authError.value = null
    try {
      const response = await authApi.register(
        form.firstName,
        form.lastName,
        form.username,
        form.email,
        form.password,
      )
      saveSession(response.token, response.user)
      return response.user
    } catch (error) {
      authError.value = error.message
      throw error
    } finally {
      authLoading.value = false
    }
  }

  async function syncMe() {
    if (!token.value) return null
    try {
      const response = await authApi.me()
      saveSession(token.value, response.user)
      return response.user
    } catch {
      clearSession()
      return null
    }
  }

  function logout() {
    clearSession()
  }

  return {
    token,
    user,
    isLoggedIn,
    authError,
    authLoading,
    login,
    register,
    syncMe,
    logout,
  }
}
