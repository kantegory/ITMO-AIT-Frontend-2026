import { ref, computed } from 'vue';

const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));

export function useAuth() {
    const isAuthenticated = computed(() => !!localStorage.getItem('accessToken'));

    const login = (userData, token) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        user.value = userData;
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        user.value = null;
        window.location.href = '/login';
    };

    return { user, isAuthenticated, login, logout };
}