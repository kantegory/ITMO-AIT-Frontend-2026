import { computed, ref } from 'vue';
import {
  clearStoredSession,
  decodeUserIdFromToken,
  readStoredSession,
  writeStoredSession,
} from '@/lib/auth';
import {
  ensureStarterData,
  fetchUserById,
  isForbiddenError,
  loginRequest,
  normalizeErrorMessage,
  registerRequest,
} from '@/services/api';

const session = ref(readStoredSession());
const hydrated = ref(false);
let hydrationPromise = null;

function sanitizeSession(payload) {
  if (!payload?.token || !payload?.user?.id) {
    return null;
  }

  return {
    token: payload.token,
    user: payload.user,
  };
}

function setSession(payload) {
  const safeValue = sanitizeSession(payload);
  session.value = safeValue;

  if (safeValue) {
    writeStoredSession(safeValue);
  } else {
    clearStoredSession();
  }
}

function clearSession() {
  session.value = null;
  clearStoredSession();
}

function buildDisplayName(user) {
  return [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.email || 'пользователь';
}

function normalizeLoginError(error) {
  const message = normalizeErrorMessage(error);
  const lower = message.toLowerCase();
  const knownFailures = [
    'ошибка api (400)',
    'ошибка api (403)',
    'incorrect password',
    'cannot find user',
    'invalid credentials',
    'bad request',
    'email or password',
    'email and password are required',
  ];

  if (knownFailures.some((token) => lower.includes(token))) {
    return 'Неверный email или пароль.';
  }

  return message;
}

function normalizeRegisterError(error) {
  const message = normalizeErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes('already exists') || lower.includes('email is already')) {
    return 'Пользователь с таким email уже существует.';
  }

  return message;
}

async function resolveUser(token, fallbackUser = null) {
  const userId = decodeUserIdFromToken(token || '');
  if (!userId) {
    return null;
  }

  try {
    return await fetchUserById(userId, token);
  } catch (error) {
    if (isForbiddenError(error)) {
      return fallbackUser || { id: userId, email: fallbackUser?.email || '' };
    }

    throw error;
  }
}

async function hydrateSession() {
  if (hydrated.value) {
    return session.value;
  }

  if (hydrationPromise) {
    return hydrationPromise;
  }

  hydrationPromise = (async () => {
    const stored = readStoredSession();
    const token = stored?.token;

    if (!token) {
      clearSession();
      hydrated.value = true;
      return null;
    }

    try {
      const user = await resolveUser(token, stored?.user);
      const nextSession = sanitizeSession({ token, user });

      if (!nextSession) {
        clearSession();
        hydrated.value = true;
        return null;
      }

      setSession(nextSession);
      await ensureStarterData(nextSession);
      hydrated.value = true;
      return nextSession;
    } catch {
      clearSession();
      hydrated.value = true;
      return null;
    }
  })().finally(() => {
    hydrationPromise = null;
  });

  return hydrationPromise;
}

async function login(payload) {
  try {
    const response = await loginRequest(payload);
    const token = response?.accessToken;

    if (!token) {
      throw new Error('Сервер не вернул корректный токен авторизации.');
    }

    const user = await resolveUser(token, response?.user || { email: payload.email });
    const nextSession = sanitizeSession({ token, user });

    if (!nextSession) {
      throw new Error('Не удалось определить пользователя после входа.');
    }

    setSession(nextSession);
    await ensureStarterData(nextSession);
    hydrated.value = true;
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: normalizeLoginError(error),
    };
  }
}

async function register(payload) {
  try {
    const response = await registerRequest(payload);
    const token = response?.accessToken;

    if (!token) {
      throw new Error('Сервер не вернул корректный токен после регистрации.');
    }

    const user = await resolveUser(token, response?.user || { email: payload.email });
    const nextSession = sanitizeSession({ token, user });

    if (!nextSession) {
      throw new Error('Не удалось определить пользователя после регистрации.');
    }

    setSession(nextSession);
    await ensureStarterData(nextSession);
    hydrated.value = true;
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      message: normalizeRegisterError(error),
    };
  }
}

function logout() {
  clearSession();
  hydrated.value = true;
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(session.value?.token && session.value?.user?.id));
  const user = computed(() => session.value?.user || null);
  const token = computed(() => session.value?.token || '');
  const userName = computed(() => buildDisplayName(user.value));

  return {
    session,
    hydrated,
    isAuthenticated,
    user,
    token,
    userName,
    hydrateSession,
    login,
    register,
    logout,
  };
}
