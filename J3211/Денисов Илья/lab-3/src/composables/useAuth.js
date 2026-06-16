import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUser, getUsers } from '../services/api';
import {
  clearStoredCurrentUser,
  getStoredCurrentUser,
  saveStoredCurrentUser
} from '../services/authStorage';

const currentUser = ref(getStoredCurrentUser());
const authLoading = ref(false);
const authError = ref('');

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = computed(() => Boolean(currentUser.value));

  function setAuthError(message) {
    authError.value = message;
  }

  function clearAuthError() {
    authError.value = '';
  }

  async function login(email, password) {
    clearAuthError();

    if (!email || !password) {
      setAuthError('Заполните email и пароль');
      return false;
    }

    authLoading.value = true;

    try {
      const users = await getUsers({ email, password });

      if (!users.length) {
        setAuthError('Неверный логин или пароль');
        return false;
      }

      currentUser.value = users[0];
      saveStoredCurrentUser(users[0]);
      await router.push({ name: 'tasks' });
      return true;
    } catch (error) {
      console.error(error);
      setAuthError('Не удалось подключиться к API');
      return false;
    } finally {
      authLoading.value = false;
    }
  }

  async function register({ name, surname, email, password, repeatPassword }) {
    clearAuthError();

    if (!name || !surname || !email || !password || !repeatPassword) {
      setAuthError('Заполните все поля');
      return false;
    }

    if (password !== repeatPassword) {
      setAuthError('Пароли не совпадают');
      return false;
    }

    authLoading.value = true;

    try {
      const existingUsers = await getUsers({ email });

      if (existingUsers.length) {
        setAuthError('Пользователь с таким email уже существует');
        return false;
      }

      const newUser = await createUser({ name, surname, email, password });
      currentUser.value = newUser;
      saveStoredCurrentUser(newUser);
      await router.push({ name: 'tasks' });
      return true;
    } catch (error) {
      console.error(error);
      setAuthError('Не удалось подключиться к API');
      return false;
    } finally {
      authLoading.value = false;
    }
  }

  async function logout() {
    currentUser.value = null;
    clearStoredCurrentUser();
    await router.push({ name: 'login' });
  }

  return {
    currentUser,
    isAuthenticated,
    authLoading,
    authError,
    clearAuthError,
    login,
    register,
    logout
  };
}
