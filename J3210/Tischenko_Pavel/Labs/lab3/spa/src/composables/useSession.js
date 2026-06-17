import { computed } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '../stores/auth'

export function useSession() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => Boolean(authStore.token))
  const userName = computed(() => {
    const first = authStore.user?.firstName || ''
    const last = authStore.user?.lastName || ''
    const full = `${first} ${last}`.trim()
    return full || authStore.user?.email || 'Гость'
  })
  const roleLabel = computed(() => {
    if (authStore.role === 'trainer') return 'тренер'
    if (authStore.role === 'student') return 'студент'
    return ''
  })

  function logout() {
    authStore.logout()
    router.push({ name: 'catalog' })
  }

  return {
    authStore,
    isAuthenticated,
    userName,
    roleLabel,
    logout
  }
}
