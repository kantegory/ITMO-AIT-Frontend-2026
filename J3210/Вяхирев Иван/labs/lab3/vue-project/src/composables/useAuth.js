import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isAuthenticated = ref(!!localStorage.getItem('accessToken'))
const userEmail = ref(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '')

export function useAuth() {
  const router = useRouter()

  const checkAuth = () => {
    if (localStorage.getItem('accessToken')) {
      isAuthenticated.value = true
      userEmail.value = JSON.parse(localStorage.getItem('user')).email
    } else {
      isAuthenticated.value = false
      userEmail.value = ''
      router.push('/login')
    }
  }

  const logout = () => {
    const theme = localStorage.getItem('theme')
    localStorage.clear()
    if (theme) localStorage.setItem('theme', theme)
    isAuthenticated.value = false
    userEmail.value = ''
    router.push('/login')
  }

  return {
    userEmail,
    isAuthenticated,
    checkAuth,
    logout
  }
}
