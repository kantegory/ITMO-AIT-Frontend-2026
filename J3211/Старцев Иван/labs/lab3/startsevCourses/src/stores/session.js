import { defineStore } from 'pinia'
import { authApi, usersApi } from '@/api'

export const useSessionStore = defineStore('session', {
    state: () => ({
        userId: null,
        currentUser: null,
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.userId),
    },

    actions: {
        setSession(user) {
            this.userId = user.id
            this.currentUser = user
        },

        clearSession() {
            this.userId = null
            this.currentUser = null
        },

        async restoreSession() {
            if (!this.userId) {
                this.currentUser = null
                return null
            }

            try {
                const user = await usersApi.getById(this.userId)
                this.currentUser = user
                return user
            } catch {
                this.clearSession()
                return null
            }
        },

        async login(credentials) {
            const response = await authApi.login(credentials)
            this.setSession(response.user)
            return response.user
        },

        async signup(payload) {
            const response = await authApi.signup(payload)
            this.setSession(response.user)
            return response.user
        },

        async patchCurrentUser(payload) {
            if (!this.userId) {
                return null
            }

            const user = await usersApi.update(this.userId, payload)
            this.setSession(user)
            return user
        },
    },

    persist: {
        pick: ['userId'],
    },
})
