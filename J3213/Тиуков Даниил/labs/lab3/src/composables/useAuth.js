import { computed } from 'vue'
import { TravelApi } from '@/api/travelApi.js'
import { useStorage, STORAGE_KEYS, clearStorage } from './useStorage.js'

export function useAuth() {
  const currentUser = useStorage(STORAGE_KEYS.currentUser, null)
  const isAuthenticated = computed(() => Boolean(currentUser.value))

  async function register(payload) {
    const existing = await TravelApi.findUserByEmail(payload.email).catch(() => null)
    if (existing) {
      return { ok: false, message: 'Пользователь с таким email уже зарегистрирован.' }
    }
    const user = await TravelApi.registerUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      preference: payload.preference || 'mixed'
    })
    currentUser.value = user
    return { ok: true, user }
  }

  async function login({ email, password }) {
    const user = await TravelApi.findUserByCredentials(email, password).catch(() => null)
    if (!user) {
      return { ok: false, message: 'Пользователь с такими данными не найден. Проверьте email и пароль или зарегистрируйтесь.' }
    }
    currentUser.value = user
    return { ok: true, user }
  }

  function logout() {
    clearStorage(STORAGE_KEYS.currentUser)
  }

  async function updateProfile(patch) {
    if (!currentUser.value) return null
    const updated = await TravelApi.updateUser(currentUser.value.id, patch)
    currentUser.value = updated
    return updated
  }

  return { currentUser, isAuthenticated, register, login, logout, updateProfile }
}
