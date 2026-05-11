import { computed, ref } from 'vue'
import { getCollection, postCollection } from '../services/api'
import { seedUserData } from '../services/mockStore'

const STORAGE_KEY = 'finance-manager-vue-session'
const rawUser = localStorage.getItem(STORAGE_KEY)
const currentUser = ref(rawUser ? JSON.parse(rawUser) : null)

function persistUser(user) {
  currentUser.value = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function clearUser() {
  currentUser.value = null
  localStorage.removeItem(STORAGE_KEY)
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value))

  const login = async ({ email, password }) => {
    const users = await getCollection('users')
    const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)

    if (!user) {
      throw new Error('Неверная почта или пароль.')
    }

    persistUser({
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency || 'RUB',
    })

    return currentUser.value
  }

  const register = async ({ name, email, password, currency }) => {
    const users = await getCollection('users')
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Пользователь с такой почтой уже существует.')
    }

    const created = await postCollection('users', { name, email, password, currency })
    await seedUserData(created)

    persistUser({
      id: created.id,
      name: created.name,
      email: created.email,
      currency: created.currency || 'RUB',
    })

    return currentUser.value
  }

  const logout = () => clearUser()

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
