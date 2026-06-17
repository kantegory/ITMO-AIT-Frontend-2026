import { computed, ref } from 'vue'
import { extractApiMessage, http, unwrap } from '@/api/http'

const STORAGE_TOKEN = 'tickethub_auth_token'
const STORAGE_USER = 'tickethub_current_user'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(key, value) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function parseJwtPayload(token) {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    let base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    while (base64.length % 4) base64 += '='
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

const currentUser = ref(readJson(STORAGE_USER))

export function useAuth() {
  const token = () => localStorage.getItem(STORAGE_TOKEN)

  const isLoggedIn = computed(
    () => !!(token() && currentUser.value && currentUser.value.id != null),
  )

  async function saveSessionFromAccessToken(accessToken) {
    if (!accessToken) throw new Error('Нет токена доступа')
    localStorage.setItem(STORAGE_TOKEN, accessToken)
    const payload = parseJwtPayload(accessToken)
    const uid = payload?.sub ?? null
    if (uid == null) throw new Error('Недействительный токен')
    const res = await http.get(`/users/${encodeURIComponent(uid)}`)
    const user = await unwrap(res, 'Не удалось загрузить профиль')
    currentUser.value = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    }
    writeJson(STORAGE_USER, currentUser.value)
  }

  async function login(email, password) {
    const res = await http.post('/login', { email, password }, { skipAuth: true })
    const data = await unwrap(res, 'Не удалось войти')
    if (!data?.accessToken) throw new Error('Сервер вернул неожиданный ответ')
    await saveSessionFromAccessToken(data.accessToken)
  }

  async function register(payload) {
    const res = await http.post(
      '/register',
      {
        email: payload.email,
        password: payload.password,
        name: payload.name,
        role: 'user',
      },
      { skipAuth: true },
    )
    const data = await unwrap(res, 'Не удалось зарегистрироваться')
    if (!data?.accessToken) throw new Error('Не удалось завершить регистрацию')
    await saveSessionFromAccessToken(data.accessToken)
  }

  function logout() {
    writeJson(STORAGE_USER, null)
    localStorage.removeItem(STORAGE_TOKEN)
    currentUser.value = null
  }

  function authErrorMessage(err, kind) {
    const m = extractApiMessage(err)
    if (kind === 'login') {
      const badCreds =
        m.includes('Unauthorized') ||
        m.includes('Cannot') ||
        m.toLowerCase().includes('password') ||
        m.toLowerCase().includes('credentials')
      return badCreds ? 'Неверный адрес почты или пароль' : m || 'Не удалось войти'
    }
    if (kind === 'register') {
      if (m.toLowerCase().includes('already') || m.includes('Email'))
        return 'Этот e-mail уже зарегистрирован'
      return m || 'Не удалось зарегистрироваться'
    }
    return m
  }

  return {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    authErrorMessage,
  }
}

export function hasStoredSession() {
  const t = localStorage.getItem(STORAGE_TOKEN)
  const u = readJson(STORAGE_USER)
  return !!(t && u && u.id != null)
}
