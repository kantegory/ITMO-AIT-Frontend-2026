import { ref, computed } from 'vue';
import http from '../api/http';

const STORAGE_KEY = 'currentUser';
const currentUser = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'));

function persist(user) {
  currentUser.value = user;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value));
  const isOrganizer = computed(() => currentUser.value?.role === 'organizer');

  async function login(email, password) {
    const { data } = await http.get('/users', {
      params: { email, password }
    });
    if (!data.length) {
      throw new Error('Неверный email или пароль.');
    }
    persist(data[0]);
    return data[0];
  }

  async function register(user) {
    const { data: existing } = await http.get('/users', {
      params: { email: user.email }
    });
    if (existing.length > 0) {
      throw new Error('Пользователь с таким email уже существует.');
    }
    const { data } = await http.post('/users', user);
    return data;
  }

  function logout() {
    persist(null);
  }

  return {
    currentUser,
    isAuthenticated,
    isOrganizer,
    login,
    register,
    logout
  };
}
