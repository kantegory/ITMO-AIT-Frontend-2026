import { ref, computed } from 'vue';
import { loginUser, registerUser, getUserByEmail, updateUser } from '@/api/users';

const STORAGE_KEY = 'user';

function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

function writeStorage(user) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

function pickPublic(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio || '',
    location: user.location || '',
  };
}

const user = ref(readStorage());
const isAuthenticated = computed(() => user.value !== null);

export function useAuth() {
  async function login(email, password) {
    const found = await loginUser(email, password);
    if (!found) return { ok: false, error: 'Неверный email или пароль.' };
    user.value = pickPublic(found);
    writeStorage(user.value);
    return { ok: true };
  }

  async function register({ name, email, password, bio, location }) {
    const existing = await getUserByEmail(email);
    if (existing) {
      return { ok: false, error: 'Пользователь с таким email уже существует.' };
    }
    const created = await registerUser({ name, email, password, bio, location });
    user.value = pickPublic(created);
    writeStorage(user.value);
    return { ok: true };
  }

  async function updateProfile(patch) {
    if (!user.value) return;
    try {
      await updateUser(user.value.id, patch);
    } catch {
      // сервер недоступен — продолжаем с локальным апдейтом
    }
    user.value = { ...user.value, ...patch };
    writeStorage(user.value);
  }

  function logout() {
    user.value = null;
    writeStorage(null);
  }

  return { user, isAuthenticated, login, register, updateProfile, logout };
}
