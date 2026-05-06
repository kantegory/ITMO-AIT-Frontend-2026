import { reactive } from 'vue'

const KEYS = {
  auth: 'taskhub-auth',
  userId: 'taskhub-user-id',
  userName: 'taskhub-user-name',
}

export const authState = reactive({
  userName: sessionStorage.getItem(KEYS.userName) || '',
  userId: sessionStorage.getItem(KEYS.userId) || '',
  isAuth: sessionStorage.getItem(KEYS.auth) === '1',
})

export function isAuthorized() {
  return authState.isAuth && Boolean(authState.userId)
}

export function saveSessionUser(user) {
  sessionStorage.setItem(KEYS.auth, '1')
  sessionStorage.setItem(KEYS.userId, user.id || '')
  sessionStorage.setItem(KEYS.userName, user.name || 'Пользователь')
  authState.userName = user.name || 'Пользователь'
  authState.userId = user.id || ''
  authState.isAuth = true
}

export function clearSession() {
  Object.values(KEYS).forEach((k) => sessionStorage.removeItem(k))
  sessionStorage.removeItem('taskhub-projects')
  authState.userName = ''
  authState.userId = ''
  authState.isAuth = false
}

export function getUserName() {
  return authState.userName
}

export function getUserId() {
  return authState.userId
}
