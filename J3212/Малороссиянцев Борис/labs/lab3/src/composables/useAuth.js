import { ref, computed } from 'vue'
const _token = ref(localStorage.getItem('wl_token') || '')
const _user  = ref((() => {
  try { return JSON.parse(localStorage.getItem('wl_user') || 'null') }
  catch { return null }
})())

export function useAuth() {
  const isLoggedIn   = computed(() => !!_token.value)
  const currentUser  = computed(() => _user.value)

  function saveSession(token, user) {
    _token.value = token
    _user.value  = user
    localStorage.setItem('wl_token', token)
    localStorage.setItem('wl_user',  JSON.stringify(user))
  }

  function clearSession() {
    _token.value = ''
    _user.value  = null
    localStorage.removeItem('wl_token')
    localStorage.removeItem('wl_user')
  }

  function getToken()   { return _token.value }
  function getUserId()  { return _user.value?.id ?? null }

  function getFullName() {
    const u = _user.value
    if (!u) return 'Гость'
    return [u.firstName, u.lastName].filter(Boolean).join(' ')
  }

  function getInitials() {
    const u = _user.value
    if (!u) return '?'
    return ((u.firstName?.[0] || '') + (u.lastName?.[0] || '')).toUpperCase() || '?'
  }

  return { isLoggedIn, currentUser, saveSession, clearSession, getToken, getUserId, getFullName, getInitials }
}
