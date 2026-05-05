import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { loginUser, registerUser } from '@/api/finance'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref('')
    const user = ref(null)

    const isAuthenticated = computed(() => Boolean(accessToken.value))

    function setSession(nextUser) {
      accessToken.value = `mock_token_${Date.now()}`
      user.value = nextUser
    }

    function clearSession() {
      accessToken.value = ''
      user.value = null
    }

    async function login(email, password) {
      const foundUser = await loginUser(email, password)
      setSession({ id: foundUser.id, email: foundUser.email })
      return foundUser
    }

    async function register(email, password) {
      return registerUser(email, password)
    }

    return {
      accessToken,
      user,
      isAuthenticated,
      setSession,
      clearSession,
      login,
      register
    }
  },
  {
    persist: true
  }
)
