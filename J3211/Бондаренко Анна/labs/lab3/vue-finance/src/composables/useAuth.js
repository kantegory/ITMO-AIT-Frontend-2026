import {computed} from 'vue'
import {useAuthStore} from '../stores/auth'

export function useAuth() {
    const authStore = useAuthStore()
    const userId = computed(() => authStore.userId)
    const isLoggedIn = computed(() => !!authStore.userId)
    const userEmail = computed(() => authStore.userEmail)

    return {userId, isLoggedIn, userEmail}
}