import {defineStore} from 'pinia'
import {financeApi} from '../api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userId: null,
        userEmail: null
    }),
    actions: {
        async login(email, password) {
            const user = await financeApi.login(email)
            if (user && user.password === password) {
                this.userId = user.id
                this.userEmail = user.email
                return true
            }
            return false
        },

        async register(email, password) {
            const exists = await financeApi.login(email)
            if (exists) {
                throw new Error('ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ СУЩЕСТВУЕТ')
            }
            await financeApi.register({email, password})
        },

        logout() {
            this.userId = null
            this.userEmail = null
        }
    }
})