// Composable для авторизации - инкапсулирует работу со store + навигацию.
// Используется в TheNavbar, LoginPage, RegisterPage, HomePage.
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import useAuthStore from '@/stores/auth'

export function useAuth() {
  const store  = useAuthStore()
  const router = useRouter()

  // storeToRefs сохраняет реактивность при деструктуризации
  const { user, error, isLoggedIn, isTeacher } = storeToRefs(store)

  async function login(email, password, role) {
    const ok = await store.login(email, password, role)
    if (ok) router.push(store.isTeacher ? '/teacher' : '/dashboard')
    return ok
  }

  async function register(firstName, lastName, email, password, role) {
    const ok = await store.register(firstName, lastName, email, password, role)
    if (ok) router.push(store.isTeacher ? '/teacher' : '/dashboard')
    return ok
  }

  function logout() {
    store.logout()
    router.push('/')
  }

  return { user, error, isLoggedIn, isTeacher, login, register, logout }
}
