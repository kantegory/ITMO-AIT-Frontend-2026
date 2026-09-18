import { computed, ref } from 'vue';
import { authApi } from '../services/api';

const STORAGE_USER = 'floworchestrator_current_user';
const STORAGE_TOKEN = 'floworchestrator_access_token';

const user = ref(readUser());
const token = ref(localStorage.getItem(STORAGE_TOKEN));

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER));
  } catch {
    return null;
  }
}

function saveSession(payload) {
  localStorage.setItem(STORAGE_TOKEN, payload.accessToken);
  localStorage.setItem(STORAGE_USER, JSON.stringify(payload.user));
  token.value = payload.accessToken;
  user.value = payload.user;
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(token.value));

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    saveSession(data);
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    token.value = null;
    user.value = null;
  };

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };
}
