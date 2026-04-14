import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        accessToken: localStorage.getItem('accessToken') || null
    }),
    actions: {
        setAuth(userData, token) {
            this.user = userData
            this.accessToken = token
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('accessToken', token)
        },
        logout() {
            this.user = null
            this.accessToken = null
            localStorage.removeItem('user')
            localStorage.removeItem('accessToken')
        }
    },
    persist: true
})
