import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('currentUser')) || null
    }),
    actions: {
        async login(email, password) {
            try {
                const { data } = await axios.get(`/users?email=${encodeURIComponent(email)}`)
                if (data.length > 0 && data[0].password === password) {
                    this.user = data[0]
                    localStorage.setItem('currentUser', JSON.stringify(this.user))
                    return true
                }
                return false
            } catch (error) {
                console.error('Ошибка входа:', error)
                return false
            }
        },
        async register(name, email, password) {
            try {
                const { data: existing } = await axios.get(`/users?email=${encodeURIComponent(email)}`)
                if (existing.length > 0) return { success: false, reason: 'exists' }
                const newUser = { name, email, password }
                await axios.post(`/users`, newUser)
                return { success: true }
            } catch (error) {
                console.error('Ошибка регистрации:', error)
                return { success: false, reason: 'error' }
            }
        },
        logout() {
            this.user = null
            localStorage.removeItem('currentUser')
        },
        async updateProfile(id, name) {
            const { data } = await axios.patch(`/users/${id}`, { name })
            this.user = data
            localStorage.setItem('currentUser', JSON.stringify(data))
        },
        async updatePassword(id, password) {
            const { data } = await axios.patch(`/users/${id}`, { password })
            this.user = data
            localStorage.setItem('currentUser', JSON.stringify(data))
        }
    }
})