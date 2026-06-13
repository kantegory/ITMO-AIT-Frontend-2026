import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const auth = useAuthStore()
  const currentUser = computed(() => auth.currentUser)
  const isLoggedIn = computed(() => !!auth.currentUser)

  return { currentUser, isLoggedIn }
}