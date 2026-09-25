import {defineStore} from 'pinia'
import {ref, computed} from 'vue'
import {authApi, usersApi} from '@/api'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref(null)
    const user = ref(null)

    const isLoggedIn = computed(() => !!token.value)
    const isTeacher = computed(() => user.value?.role === 'teacher')
    const isStudent = computed(() => user.value?.role === 'student')

    async function login(credentials) {
      const {data} = await authApi.login(credentials)
      token.value = data.accessToken

      const {data: fullUser} = await usersApi.getById(data.user.id)
      user.value = fullUser
      return fullUser
    }

    async function register(userData) {
      const {data} = await authApi.register(userData)
      token.value = data.accessToken

      const fullUser = {...data.user, role: userData.role, name: userData.name}
      user.value = fullUser
      return fullUser
    }

    function logout() {
      token.value = null
      user.value = null
    }

    function refreshUser(updatedData) {
      user.value = {...user.value, ...updatedData}
    }

    return {token, user, isLoggedIn, isTeacher, isStudent, login, register, logout, refreshUser}
  },
  {
    persist: true,
  }
)
