import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotesStore } from '@/stores/notes'
import { useRoutesStore } from '@/stores/routes'
import { useNotification } from './useNotification'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const notesStore = useNotesStore()
  const routesStore = useRoutesStore()
  const { showNotification } = useNotification()

  const isLoading = ref(false)

  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const currentUser = computed(() => authStore.user)

  const login = async (email, password) => {
    isLoading.value = true
    try {
      const result = await authStore.login({ email, password })
      showNotification('Вход выполнен успешно!')
      await Promise.all([
        notesStore.loadNotes(),
        routesStore.loadRoutes()
      ])
      router.push('/dashboard')
      return result
    } catch (error) {
      showNotification(error.message || 'Ошибка входа', true)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name, email, password) => {
    isLoading.value = true
    try {
      const result = await authStore.register({ name, email, password })
      showNotification('Регистрация успешна!')
      router.push('/dashboard')
      return result
    } catch (error) {
      showNotification(error.message || 'Ошибка регистрации', true)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authStore.logout()
    showNotification('Вы вышли из системы')
    router.push('/login')
  }

  return {
    isAuthenticated,
    currentUser,
    isLoading,
    login,
    register,
    logout
  }
}