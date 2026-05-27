import { ref } from 'vue'

const ROLE_KEY = 'lab3Role'
const USER_KEY = 'lab3User'

const role = ref(sessionStorage.getItem(ROLE_KEY) || '')
const user = ref(JSON.parse(sessionStorage.getItem(USER_KEY) || 'null'))

export function useAuth() {
  const login = (selectedRole, userData = null) => {
    role.value = selectedRole
    user.value = userData
    sessionStorage.setItem(ROLE_KEY, selectedRole)
    if (userData) sessionStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    role.value = ''
    user.value = null
    sessionStorage.removeItem(ROLE_KEY)
    sessionStorage.removeItem(USER_KEY)
  }

  const cabinetRoute = () => (role.value === 'admin' ? '/admin' : '/tenant')

  const roleLabel = (r = role.value) => (r === 'admin' ? 'Администрация' : 'Арендатор')

  return { role, user, login, logout, cabinetRoute, roleLabel }
}
