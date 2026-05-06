import { ref } from 'vue'
import { loginUser, registerUser } from '@/api/index.js'
import { saveSessionUser } from '@/stores/auth.js'

export function useAuth() {
  const error = ref('')
  const loading = ref(false)

  async function login(email, password) {
    error.value = ''
    loading.value = true

    try {
      const user = await loginUser(email, password)

      if (!user) {
        error.value = 'Не удалось войти. Проверь email и пароль.'
        return false
      }

      saveSessionUser(user)
      return true
    } catch {
      error.value = 'Не получилось подключиться к серверу. Проверь, что json-server запущен.'
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    error.value = ''
    loading.value = true

    try {
      await registerUser(userData)
      return true
    } catch (e) {
      error.value = e.message || 'Не удалось создать аккаунт.'
      return false
    } finally {
      loading.value = false
    }
  }

  return { error, loading, login, register }
}
