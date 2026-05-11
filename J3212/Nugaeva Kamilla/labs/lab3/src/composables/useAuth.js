import { ref } from 'vue'
import { authApi } from '../api/index.js'

const currentUser = ref(getSavedCurrentUser())

export function useAuth() {
  const isLoading = ref(false)
  const error = ref('')
  const message = ref('')

  async function login(email, password) {
    isLoading.value = true
    error.value = ''
    message.value = ''

    try {
      const response = await authApi.getUsers()

      const user = response.data.find((item) => {
        return item.email === email && String(item.password) === String(password)
      })

      if (!user) {
        error.value = 'Пользователь не найден или пароль неверный.'
        return false
      }

      setCurrentUser(user)
      message.value = 'Вход выполнен успешно.'
      return true
    } catch {
      const demoUser = {
        id: 'demo-user',
        name: email || 'Пользователь',
        email,
      }

      setCurrentUser(demoUser)
      message.value = 'Вход выполнен в demo-режиме.'
      return true
    } finally {
      isLoading.value = false
    }
  }

  async function register(name, email, password, passwordRepeat) {
    isLoading.value = true
    error.value = ''
    message.value = ''

    if (password.length < 6) {
      error.value = 'Пароль должен быть не короче 6 символов.'
      isLoading.value = false
      return false
    }

    if (password !== passwordRepeat) {
      error.value = 'Пароли не совпадают.'
      isLoading.value = false
      return false
    }

    const newUser = {
      name,
      email,
      password,
    }

    try {
      await authApi.register(newUser)
      message.value = 'Аккаунт создан. Теперь можно перейти на страницу входа.'
    } catch {
      localStorage.setItem('travel_registered_user', JSON.stringify(newUser))
      message.value = 'Аккаунт создан в demo-режиме.'
    } finally {
      isLoading.value = false
    }

    return true
  }

  function setCurrentUser(user) {
    currentUser.value = user
    localStorage.setItem('travel_current_user', JSON.stringify(user))
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('travel_current_user')
  }

  return {
    currentUser,
    isLoading,
    error,
    message,
    login,
    register,
    logout,
  }
}

function getSavedCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('travel_current_user'))
  } catch {
    return null
  }
}