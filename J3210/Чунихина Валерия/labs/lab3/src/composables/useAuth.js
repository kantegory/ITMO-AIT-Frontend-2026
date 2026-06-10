import { ref } from 'vue'
import axios from 'axios'

const EXTRA_USERS_KEY = 'aibloom-extra-users'
const CURRENT_USER_KEY = 'currentUser'

export const currentUser = ref(
  JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null')
)

async function loadUsers() {
  const { data } = await axios.get('/db.json')
  const extraUsers = JSON.parse(localStorage.getItem(EXTRA_USERS_KEY) || '[]')

  return [...(data.users || []), ...extraUsers]
}

export function useAuth(router) {
  const loading = ref(false)
  const error = ref('')

  async function login(form) {
    loading.value = true
    error.value = ''

    try {
      const users = await loadUsers()
      const matchedUser = users.find((user) => (
        user.email === form.email.trim() && user.password === form.password
      ))

      if (!matchedUser) {
        error.value = 'Неверный email или пароль.'
        return false
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser))
      currentUser.value = matchedUser

      await router.push('/profile')
      return true
    } catch (requestError) {
      console.error('Ошибка входа:', requestError)
      error.value = 'Не удалось загрузить данные пользователей из db.json.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(form) {
    loading.value = true
    error.value = ''

    try {
      const users = await loadUsers()
      const email = form.email.trim()

      if (users.some((user) => user.email === email)) {
        error.value = 'Пользователь с таким email уже существует.'
        return false
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: form.name.trim(),
        email,
        password: form.password,
        city: form.city.trim() || 'Новый сад'
      }

      const extraUsers = JSON.parse(localStorage.getItem(EXTRA_USERS_KEY) || '[]')
      localStorage.setItem(EXTRA_USERS_KEY, JSON.stringify([...extraUsers, newUser]))
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))
      currentUser.value = newUser

      await router.push('/profile')
      return true
    } catch (requestError) {
      console.error('Ошибка регистрации:', requestError)
      error.value = 'Не удалось сохранить пользователя.'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout(router) {
    localStorage.removeItem(CURRENT_USER_KEY)
    currentUser.value = null
    router.push('/')
  }

  return {
    loading,
    error,
    login,
    register,
    logout
  }
}
