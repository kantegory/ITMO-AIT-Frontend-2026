import { computed, ref } from 'vue'
import { apiLogin, apiRegister } from '../api/auth'
import { getUserById, updateUser } from '../api/users'

const STORAGE_CURRENT_USER_KEY = 'eventpass_current_user'
const STORAGE_REMEMBERED_USER_KEY = 'eventpass_remembered_user'

const currentUser = ref(null)
const isAuthLoaded = ref(false)

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') {
    return user
  }

  const { password: _password, ...safeUser } = user
  return safeUser
}

function getStoredCurrentUserId() {
  return localStorage.getItem(STORAGE_CURRENT_USER_KEY) || sessionStorage.getItem(STORAGE_CURRENT_USER_KEY)
}

function isRememberMeEnabled() {
  return !!localStorage.getItem(STORAGE_CURRENT_USER_KEY)
}

function setRememberedUser(user) {
  localStorage.setItem(STORAGE_REMEMBERED_USER_KEY, JSON.stringify(sanitizeUser(user)))
}

function getRememberedUser() {
  const raw = localStorage.getItem(STORAGE_REMEMBERED_USER_KEY)
  if (!raw) {
    return null
  }

  try {
    return sanitizeUser(JSON.parse(raw))
  } catch {
    localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY)
    return null
  }
}

function setCurrentUserId(userId, rememberMe) {
  const normalizedUserId = String(userId)

  if (rememberMe) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, normalizedUserId)
    sessionStorage.removeItem(STORAGE_CURRENT_USER_KEY)
    return
  }

  sessionStorage.setItem(STORAGE_CURRENT_USER_KEY, normalizedUserId)
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
  localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY)
}

function clearCurrentUserId() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY)
  localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY)
  sessionStorage.removeItem(STORAGE_CURRENT_USER_KEY)
}

function getCabinetRouteForUser(user) {
  return user && user.accountType === 'organizer' ? '/organizer' : '/profile'
}

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)
  const cabinetRoute = computed(() => getCabinetRouteForUser(currentUser.value))

  async function loadCurrentUser() {
    const userId = getStoredCurrentUserId()

    if (!userId) {
      currentUser.value = null
      isAuthLoaded.value = true
      return null
    }

    try {
      const user = sanitizeUser(await getUserById(userId))
      currentUser.value = user

      if (isRememberMeEnabled()) {
        setRememberedUser(user)
      }

      isAuthLoaded.value = true
      return user
    } catch (error) {
      if (error?.response?.status === 404) {
        logout()
        return null
      }

      const rememberedUser = isRememberMeEnabled() ? getRememberedUser() : null
      currentUser.value = rememberedUser && String(rememberedUser.id) === String(userId) ? rememberedUser : null
      isAuthLoaded.value = true
      return currentUser.value
    }
  }

  async function login(email, password, rememberMe) {
    const response = await apiLogin(email, password)
    const user = sanitizeUser(response.user)
    setCurrentUserId(user.id, rememberMe)

    if (rememberMe) {
      setRememberedUser(user)
    }

    currentUser.value = user
    return user
  }

  async function register(payload) {
    const response = await apiRegister(payload)
    const user = sanitizeUser(response.user)
    setCurrentUserId(user.id, true)
    setRememberedUser(user)
    currentUser.value = user
    return user
  }

  async function persistUser(user) {
    const savedUser = sanitizeUser(await updateUser(user))
    currentUser.value = savedUser

    if (isRememberMeEnabled()) {
      setRememberedUser(savedUser)
    }

    return savedUser
  }

  function logout() {
    clearCurrentUserId()
    currentUser.value = null
    isAuthLoaded.value = true
  }

  return {
    currentUser,
    isAuthenticated,
    isAuthLoaded,
    rememberMeEnabled: isRememberMeEnabled,
    cabinetRoute,
    getCabinetRouteForUser,
    loadCurrentUser,
    login,
    register,
    persistUser,
    logout,
  }
}
