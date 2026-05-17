import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

const token = ref(localStorage.getItem('token'));
const userEmail = ref(localStorage.getItem('userEmail'));

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(email, password) {
    const { data } = await api.get('/users', { params: { email } });
    const user = data[0];

    if (!user || user.password !== password) {
      throw new Error('Неверный email или пароль');
    }

    token.value = user.id;
    userEmail.value = user.email;
    localStorage.setItem('token', user.id);
    localStorage.setItem('userEmail', user.email);
    await router.push({ name: 'dashboard' });
  }

  async function register(payload) {
    await api.post('/users', {
      ...payload,
      createdAt: new Date().toISOString().split('T')[0],
    });
  }

  async function logout() {
    token.value = null;
    userEmail.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    await router.push({ name: 'login' });
  }

  return {
    isAuthenticated,
    userEmail,
    login,
    logout,
    register,
  };
}
