import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useApi from './useApi';

const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const isAuthenticated = computed(() => !!user.value);
const loading = ref(false);
const error = ref(null);

export default function useAuth() {
    const router = useRouter();
    const api = useApi();

    async function login(email, password) {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/users');
            const users = response.data;
            
            const foundUser = users.find(u => u.email === email && u.password === password);
            
            if (foundUser) {
                user.value = foundUser; 
                localStorage.setItem('user', JSON.stringify(foundUser));
                await router.push('/dashboard');
                return true;
            } else {
                throw new Error('Неверный email или пароль');
            }
        } catch (err) {
            error.value = err.message;
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function register(userData) {
        loading.value = true;
        error.value = null;
        try {
            const responseAll = await api.get('/users');
            const allUsers = responseAll.data;

            const isEmailTaken = allUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
            
            if (isEmailTaken) {
                throw new Error('Пользователь с таким email уже существует');
            }

            const response = await api.post('/users', userData);
            user.value = response.data;
            localStorage.setItem('user', JSON.stringify(response.data));
            await router.push('/dashboard');
            return true;
        } catch (err) {
            error.value = err.message;
            console.error(err);
            return false;
        } finally {
            loading.value = false;
        }
    }

    function logout() {
        user.value = null;
        localStorage.removeItem('user');
        router.push('/login');
    }

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
    };
}