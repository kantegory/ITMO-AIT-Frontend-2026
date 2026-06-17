import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const userId = ref(localStorage.getItem('mff_user_id'))
const userName = ref(localStorage.getItem('mff_user_name'))

export function normalizeId(value) {
  return String(value).match(/^[0-9]+$/) ? Number(value) : value
}

export function useAuth() {
  const router = useRouter()

  const isAuthenticated = computed(() => Boolean(userId.value))

  function setUser(user) {
    userId.value = user.id
    userName.value = user.name

    localStorage.setItem('mff_user_id', user.id)
    localStorage.setItem('mff_user_name', user.name)
  }

  function logout() {
    userId.value = null
    userName.value = null

    localStorage.removeItem('mff_user_id')
    localStorage.removeItem('mff_user_name')

    router.push({ name: 'login' })
  }

  return {
    userId,
    userName,
    isAuthenticated,
    setUser,
    logout,
  }
}
