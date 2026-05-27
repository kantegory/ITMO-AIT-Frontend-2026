import { computed, reactive } from 'vue'

const TOKEN_KEY = 'ai-hub-auth-token'
const USER_KEY = 'ai-hub-auth-user'

const state = reactive({
  token: readToken(),
  user: readUser()
})

function clearKeyEverywhere(key) {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

function readToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || ''
}

function readUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getActiveStorage() {
  if (localStorage.getItem(TOKEN_KEY)) return localStorage
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage
  return localStorage
}

function saveSession(token, user, remember = true) {
  const storage = remember ? localStorage : sessionStorage

  clearKeyEverywhere(TOKEN_KEY)
  clearKeyEverywhere(USER_KEY)

  storage.setItem(TOKEN_KEY, token)
  storage.setItem(USER_KEY, JSON.stringify(user || null))

  state.token = token
  state.user = user || null
}

function setUser(user) {
  const storage = getActiveStorage()
  storage.setItem(USER_KEY, JSON.stringify(user || null))
  state.user = user || null
}

function clearSession() {
  clearKeyEverywhere(TOKEN_KEY)
  clearKeyEverywhere(USER_KEY)
  state.token = ''
  state.user = null
}

function syncFromStorage() {
  state.token = readToken()
  state.user = readUser()
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', syncFromStorage)
}

export function useSession() {
  return {
    state,
    isAuthenticated: computed(() => Boolean(state.token)),
    saveSession,
    setUser,
    clearSession
  }
}
