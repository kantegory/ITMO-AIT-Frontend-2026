import { computed, ref } from 'vue'

const STORAGE_KEY = 'travelPlanUser'
const user = ref(readStoredUser())

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
  } catch {
    return null
  }
}

function storeUser(value) {
  user.value = value
  if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  else localStorage.removeItem(STORAGE_KEY)
}

export function isAuthenticated() {
  return Boolean(readStoredUser())
}

export function useAuth() {
  const isLoggedIn = computed(() => Boolean(user.value))

  function login({ email }) {
    const saved = readStoredUser()
    const name = saved?.email === email
      ? saved.name
      : email.split('@')[0] || 'Путешественник'
    storeUser({ name, email })
  }

  function register({ name, email }) {
    storeUser({ name, email })
  }

  function logout() {
    storeUser(null)
  }

  return { user, isLoggedIn, login, register, logout }
}
