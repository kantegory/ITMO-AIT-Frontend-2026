import { ref } from 'vue'
import api from '@/api/api'
import router from '@/router'

const cookieName = 'userid'
const currentUser = ref(null)

const emitChange = () => {
  window.dispatchEvent(new Event('userchange'))
}

const getUserId = () => {
    const match = document.cookie.match(/(?:^|;\s*)userid=([^;]+)/)

    if (!match) {
        return null
    }

    return Number(match[1])
}

const setSession = (user) => {
  currentUser.value = user
  document.cookie = `${cookieName}=${user.id}; path=/`
  emitChange()
}

const clearSession = () => {
  currentUser.value = null
  document.cookie = `${cookieName}=; path=/; max-age=0;`
  emitChange()
}

const loadCurrentUser = async () => {
  const userId = getUserId()
  if (!userId) {
    currentUser.value = null
    return null
  }
  if (currentUser.value && currentUser.value.id === userId) {
    return currentUser.value
  }
  try {
    currentUser.value = await api.getUser(userId)
    return currentUser.value
  } catch {
    clearSession()
    return null
  }
}

const requireAuth = async () => {
  const user = await loadCurrentUser()

  if (!user) {
    await router.push('/login')
    return null
  }

  return user
}

const redirectAuth = async () => {
  const user = await loadCurrentUser()

  if (user) {
    await router.replace('/courses')
    return true
  }

  return false
}

const updateCurrentUser = (user) => {
  currentUser.value = user
  emitChange()
}

export function useAuth() {
  return {
    currentUser,
    getUserId,
    loadCurrentUser,
    requireAuth,
    redirectAuth,
    setSession,
    clearSession,
    updateCurrentUser,
  }
}
