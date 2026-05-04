import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const user = computed(() => authStore.user)
  const userName = computed(() => authStore.userName)
  const userRole = computed(() => authStore.userRole)
  const isTeacher = computed(() => authStore.userRole === 'teacher')
  const isStudent = computed(() => authStore.userRole === 'student')

  async function login(credentials) {
    try {
      const data = await authStore.login({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password.trim()
      })
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Ошибка входа' }
    }
  }

  async function register(userData) {
    try {
      const data = await authStore.register(userData)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message || 'Ошибка регистрации' }
    }
  }

  function logout(redirectPath = '/') {
    authStore.logout()
    router.push(redirectPath)
  }

  function hasAccess(allowedRoles = []) {
    if (!isAuthenticated.value) return false
    if (allowedRoles.length === 0) return true
    return allowedRoles.includes(userRole.value)
  }

  function init() {
    authStore.init()
  }

  return {
    isAuthenticated,
    user,
    userName,
    userRole,
    isTeacher,
    isStudent,

    login,
    register,
    logout,
    hasAccess,
    init
  }
}