import { ref, computed } from 'vue'
import { AppAPI } from '../api/api'

const STORAGE_KEY = 'currentUser'

const readUserFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

const currentUser = ref(readUserFromStorage())

const setUser = (user) => {
  currentUser.value = user
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value))
  const isTeacher = computed(() => currentUser.value?.role === 'teacher')
  const isStudent = computed(() => currentUser.value?.role === 'student')

  const login = async (email, password) => {
    const user = await AppAPI.login(email, password)
    setUser(user)
    return user
  }

  const register = async (payload) => {
    const user = await AppAPI.register(payload)
    setUser(user)
    return user
  }

  const logout = () => {
    setUser(null)
  }

  const updateUserData = (patch) => {
    if (!currentUser.value) return
    setUser({ ...currentUser.value, ...patch })
  }

  return {
    currentUser,
    isAuthenticated,
    isTeacher,
    isStudent,
    login,
    register,
    logout,
    updateUserData
  }
}
