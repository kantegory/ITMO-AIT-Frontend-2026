import { computed, ref } from 'vue';
import { createUser, fetchUserByCredentials, fetchUsersByEmail } from '../api/auth';

const STORAGE_KEY = 'kontramarkaCurrentUser';
const currentUser = ref(readStoredUser());
const isLoading = ref(false);
const error = ref('');

function readStoredUser() {
  try {
    const rawUser = localStorage.getItem(STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (storageError) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveCurrentUser(user) {
  const userToStore = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  currentUser.value = userToStore;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userToStore));
  return userToStore;
}

function clearError() {
  error.value = '';
}

function setError(message) {
  error.value = message;
}

function isNetworkError(requestError) {
  return !requestError.response;
}

function createAuthError(code, message) {
  const requestError = new Error(message);
  requestError.code = code;
  return requestError;
}

function getAuthErrorMessage(requestError, fallbackMessage) {
  if (isNetworkError(requestError)) {
    return 'Сервис временно недоступен. Попробуйте позже.';
  }

  return requestError.message || fallbackMessage;
}

async function login(email, password) {
  clearError();
  isLoading.value = true;

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await fetchUserByCredentials(normalizedEmail, password);

    if (!user) {
      throw createAuthError('INVALID_CREDENTIALS', 'Неверная электронная почта или пароль.');
    }

    return saveCurrentUser(user);
  } catch (requestError) {
    const message = requestError.code === 'INVALID_CREDENTIALS'
      ? requestError.message
      : getAuthErrorMessage(requestError, 'Не удалось выполнить вход. Проверьте введённые данные.');

    setError(message);
    throw requestError;
  } finally {
    isLoading.value = false;
  }
}

async function register(payload) {
  clearError();
  isLoading.value = true;

  try {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const existingUsers = await fetchUsersByEmail(normalizedEmail);

    if (existingUsers.length > 0) {
      throw createAuthError('EMAIL_EXISTS', 'Пользователь с такой электронной почтой уже существует.');
    }

    const user = await createUser({
      name: payload.name.trim(),
      email: normalizedEmail,
      password: payload.password
    });

    return saveCurrentUser(user);
  } catch (requestError) {
    const message = requestError.code === 'EMAIL_EXISTS'
      ? requestError.message
      : getAuthErrorMessage(requestError, 'Не удалось зарегистрироваться. Проверьте введённые данные.');

    setError(message);
    throw requestError;
  } finally {
    isLoading.value = false;
  }
}

function logout() {
  currentUser.value = null;
  localStorage.removeItem(STORAGE_KEY);
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentUser.value));

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    storageKey: STORAGE_KEY
  };
}
