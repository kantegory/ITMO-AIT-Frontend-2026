import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import useAuthStore from '@/stores/auth'
import useToast from '@/composables/useToast'

export default function useAuth() {
  const store = useAuthStore()
  const router = useRouter()
  const { showToast } = useToast()
  const { user, accessToken, isAuthenticated, isOrganizer } = storeToRefs(store)

  const login = async (credentials) => {
    try {
      await store.login(credentials)
      router.push({ name: 'profile' })
      return true
    } catch (error) {
      showToast('Неверный email или пароль')
      return false
    }
  }

  const register = async (payload) => {
    try {
      await store.register(payload)
      router.push({ name: 'profile' })
      return true
    } catch (error) {
      showToast(`Не удалось зарегистрироваться: ${error.message}`)
      return false
    }
  }

  const logout = () => {
    store.logout()
    router.push({ name: 'home' })
  }

  return { user, accessToken, isAuthenticated, isOrganizer, login, register, logout }
}
