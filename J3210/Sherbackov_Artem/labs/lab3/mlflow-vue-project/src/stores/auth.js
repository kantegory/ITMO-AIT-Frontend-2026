import { defineStore } from 'pinia';
import { authApi } from '@/api/auth';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);
  const error = ref(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!user.value);

  async function login({ email, password }) {
    isLoading.value = true;
    error.value = null;
    try {
      const users = await authApi.findUserByEmail(email);
      const foundUser = users[0];

      if (foundUser && foundUser.password === password) {
        user.value = foundUser;
        localStorage.setItem('user', JSON.stringify(foundUser));
        router.push('/dashboard');
      } else {
        throw new Error('Неверный email или пароль');
      }
    } catch (err) {
      error.value = err.message;
      alert(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  async function signup(userData) {
    isLoading.value = true;
    error.value = null;
    try {
      const existing = await authApi.findUserByEmail(userData.email);
      if (existing.length > 0) throw new Error('Пользователь уже существует');

      await authApi.register(userData);
      alert('Регистрация успешна! Теперь войдите.');
    } catch (err) {
      error.value = err.message;
      alert(error.value);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    user.value = null;
    localStorage.removeItem('user');
    router.push('/');
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout
  };
});