import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()
  const user = ref(JSON.parse(localStorage.getItem('app_session')) || null)

  const checkAuth = () => {
    if (!user.value) {
      router.push('/login')
    }
  }

  const logout = () => {
    localStorage.removeItem('app_session')
    user.value = null
    router.push('/login')
  }

  return { user, checkAuth, logout }
}