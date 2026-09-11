import { computed, ref } from 'vue'
import { usersApi } from '@/api'

const STORAGE_KEY = 'currentUser'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const currentUser = ref(readStoredUser())

function saveUser(user) {
  currentUser.value = user
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value))

  async function login(email, password) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = await usersApi.findByEmail(normalizedEmail)
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password)

    if (!user) throw new Error('Неверный email или пароль')

    const sessionUser = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }
    saveUser(sessionUser)
    return sessionUser
  }

  async function register({ name, surname, email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const existingUsers = await usersApi.findByEmail(normalizedEmail)
    if (existingUsers.length) throw new Error('Этот email уже зарегистрирован')

    const created = await usersApi.create({
      name: name.trim(),
      surname: surname.trim(),
      email: normalizedEmail,
      password,
    })

    const sessionUser = {
      id: created.id,
      name: created.name,
      surname: created.surname,
      email: created.email,
    }
    saveUser(sessionUser)
    return sessionUser
  }

  function logout() {
    saveUser(null)
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
  }
}

export function getStoredUser() {
  return currentUser.value
}
