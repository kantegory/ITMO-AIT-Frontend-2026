import { defineStore } from 'pinia'
import { usersApi } from '@/api'

const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('currentUser') || 'null'),
        token: localStorage.getItem('accessToken') || null
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
        isTeacher: (state) => state.user?.role === 'teacher',
    },
    actions: {
        async login(email, password) {
            try {
                const response = await usersApi.login({ email, password })
                console.log('Login response:', response)
                console.log('Response data:', response.data)

                const token = response.data?.accessToken
                const user = response.data?.user

                if (!token || !user) {
                    throw new Error('Неверный формат ответа от сервера')
                }

                this.token = token
                this.user = user
                localStorage.setItem('accessToken', token)
                localStorage.setItem('currentUser', JSON.stringify(user))
            } catch (err) {
                console.error('Login error:', err)
                throw err
            }
        },
        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('accessToken')
            localStorage.removeItem('currentUser')
        }
    }
})

export default useAuthStore