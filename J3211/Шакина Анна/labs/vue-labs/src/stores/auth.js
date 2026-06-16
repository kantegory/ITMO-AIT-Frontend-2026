import { defineStore } from 'pinia'
import { usersApi } from '@/api'

const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        isTeacher: (state) => state.user?.role === 'teacher',
    },
    actions: {
        async login(email, password) {
            const response = await usersApi.login({ email, password })
            this.token = response.data.accessToken
            this.user = response.data.user
            localStorage.setItem('accessToken', this.token)
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('accessToken')
        }
    },
    persist: { key: 'auth' }
})

export default useAuthStore