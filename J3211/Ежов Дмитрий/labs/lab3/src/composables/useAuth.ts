import { computed, ref } from 'vue';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
} from '../api/auth';
import type { LoginRequest, RegisterRequest } from '../types/api';
import type { User } from '../types/domain';

const user = ref<User | null>(getCurrentUser());

export function useAuth() {
  async function login(payload: LoginRequest): Promise<void> {
    user.value = await apiLogin(payload);
  }

  async function register(payload: RegisterRequest): Promise<void> {
    user.value = await apiRegister(payload);
  }

  function logout(): void {
    apiLogout();
    user.value = null;
  }

  function refresh(): void {
    user.value = getCurrentUser();
  }

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => user.value !== null),
    login,
    register,
    logout,
    refresh,
  };
}
