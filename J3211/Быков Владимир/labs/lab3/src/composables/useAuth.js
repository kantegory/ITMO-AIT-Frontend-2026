import { computed, ref } from 'vue';
import { api } from '../services/api';

const token = ref(localStorage.getItem('datamark-token'));
const user = ref(JSON.parse(localStorage.getItem('datamark-user') || 'null'));

export function getSavedToken() {
    return localStorage.getItem('datamark-token');
}

function saveAuth(data) {
    token.value = data.accessToken;
    user.value = data.user;

    localStorage.setItem('datamark-token', data.accessToken);
    localStorage.setItem('datamark-user', JSON.stringify(data.user));
}

export function useAuth() {
    const isLoggedIn = computed(() => Boolean(token.value));

    async function login(email, password) {
        const { data } = await api.post('/login', {
            email,
            password
        });

        saveAuth(data);
    }

    async function register(payload) {
        const { data } = await api.post('/register', payload);

        saveAuth(data);
    }

    function logout() {
        token.value = null;
        user.value = null;

        localStorage.removeItem('datamark-token');
        localStorage.removeItem('datamark-user');
    }

    return {
        token,
        user,
        isLoggedIn,
        login,
        register,
        logout
    };
}
