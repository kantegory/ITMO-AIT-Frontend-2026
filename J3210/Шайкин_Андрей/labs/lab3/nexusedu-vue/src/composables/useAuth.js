import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/api/instance'

const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const token = ref(localStorage.getItem('accessToken') || null)

export function useAuth() {
    const router = useRouter()

    const isAuthenticated = computed(() => !!token.value)

    const login = async (email, password) => {
        try {
            const res = await api.post('/login', { email, password })
            token.value = res.data.accessToken
            user.value = res.data.user
            
            localStorage.setItem('accessToken', token.value)
            localStorage.setItem('user', JSON.stringify(user.value))
            
            router.push({ name: 'profile' })
        } catch (e) {
            alert('Ошибка входа. Проверьте данные.')
            console.error(e)
        }
    }

    const register = async (firstName, lastName, email, password) => {
        try {
            const res = await api.post('/register', { firstName, lastName, email, password })
            token.value = res.data.accessToken
            user.value = res.data.user
            
            localStorage.setItem('accessToken', token.value)
            localStorage.setItem('user', JSON.stringify(user.value))
            
            router.push({ name: 'profile' })
        } catch (e) {
            alert('Ошибка регистрации. Возможно, email уже занят.')
            console.error(e)
        }
    }

    const logout = () => {
        token.value = null
        user.value = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        router.push({ name: 'catalog' })
    }

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout
    }
}