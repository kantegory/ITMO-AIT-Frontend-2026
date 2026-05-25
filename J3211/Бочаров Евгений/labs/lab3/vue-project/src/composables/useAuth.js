import { ref, computed } from 'vue'
import { AuthAPI } from '@/api/endpoints'

const token = ref(localStorage.getItem('authToken') || null)
const currentUser = ref(JSON.parse(localStorage.getItem('currentUser')) || null)

export function useAuth() {
    const isAuthenticated = computed(() => !!token.value)
    const hasRole = (role) => currentUser.value?.role === role

    const login = async (credentials) => {
        try {
            const data = await AuthAPI.login(credentials)
            token.value = data.accessToken
            currentUser.value = data.user
            localStorage.setItem('authToken', data.accessToken)
            localStorage.setItem('currentUser', JSON.stringify(data.user))
            return data.user
        } catch (e) {
            console.error('Login error:', e)
            throw e
        }
    }

    const register = async (userData) => {
        try {
            const data = await AuthAPI.register(userData)
            if (data.accessToken) {
                token.value = data.accessToken
                currentUser.value = data.user
                localStorage.setItem('authToken', data.accessToken)
                localStorage.setItem('currentUser', JSON.stringify(data.user))
            }
            return data.user
        } catch (e) {
            console.error('Register error:', e)
            throw e
        }
    }

    const logout = () => {
        token.value = null
        currentUser.value = null
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
        window.dispatchEvent(new CustomEvent('auth:logout'))
    }

    return { token, currentUser, isAuthenticated, hasRole, login, register, logout }
}

export const checkAuth = () => !!localStorage.getItem('authToken')
export const getCurrentUser = () => {
    const user = localStorage.getItem('currentUser')
    return user ? JSON.parse(user) : null
}
export const hasRole = (role) => {
    const user = getCurrentUser()
    return user?.role === role
}