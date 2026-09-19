import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  return {
    user,
    isAuthenticated,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout
  }
}