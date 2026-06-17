import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

export function useAuth() {
    const store = useAuthStore()
    const router = useRouter()

    const user = computed(() => store.user)

    const logout = () => {
        store.logout()
        router.push('/login')
    }

    const redirectByUserRole = (userData) => {
        if (userData.role === 'teacher') {
            router.push('/teacher')
        } else {
            router.push('/profile')
        }
    }

    return {user, logout, redirectByUserRole}
}
