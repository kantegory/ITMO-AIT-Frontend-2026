import {computed} from 'vue'
import {useAuthStore} from '@/stores/auth'

export function useAuth() {
  const store = useAuthStore()

  const isAuthenticated = computed(() => store.isAuthenticated)
  const isTeacher = computed(() => store.isTeacher)
  const user = computed(() => store.user)
  const fullName = computed(() => store.fullName)

  async function login(email, password) {
    return await store.login(email, password)
  }

  async function register(userData) {
    return await store.register(userData)
  }

  function logout() {
    store.logout()
  }

  async function refreshUser() {
    await store.refreshUser()
  }

  return {
    isAuthenticated,
    isTeacher,
    user,
    fullName,
    login,
    register,
    logout,
    refreshUser
  }
}
