import { ref } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(JSON.parse(localStorage.getItem('app_session')) || null)

export function useAuth() {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('app_session')
    user.value = null
    router.push('/login')
  }

  const setUser = (value) => {
    user.value = value
    localStorage.setItem('app_session', JSON.stringify(value))
  }

  return { user, setUser, logout }
}