import { ref, computed } from 'vue'
import { useApi } from './useApi'

const accessToken = ref(localStorage.getItem('accessToken') || '')
const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

export function useAuth() {
    const api = useApi()
    const isAuth = computed(() => !!accessToken.value)

    async function login(email, password) {
        const { data } = await api.post('/login', { email, password })
        accessToken.value = data.accessToken
        user.value = data.user
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    async function register(payload) {
        const { data } = await api.post('/register', payload)
        accessToken.value = data.accessToken
        user.value = data.user
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('user', JSON.stringify(data.user))
    }

    function logout() {
        accessToken.value = ''
        user.value = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
    }

    return { accessToken, user, isAuth, login, register, logout }
}