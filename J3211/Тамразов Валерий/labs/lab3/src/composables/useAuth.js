import { ref, computed } from 'vue';
import * as authApi from '../api/auth';

const readUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

const user = ref(readUser());
const token = ref(localStorage.getItem('accessToken'));

const persist = (data) => {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  token.value = data.accessToken;
  user.value = data.user;
};

const clear = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  token.value = null;
  user.value = null;
};

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    persist(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authApi.register(userData);
    persist(data);
    return data;
  };

  const logout = () => {
    clear();
  };

  return { user, token, isLoggedIn, login, register, logout };
}
