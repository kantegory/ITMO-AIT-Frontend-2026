import { ref, computed } from "vue";
import { usersApi } from "../api/api.js";

const CURRENT_USER_KEY = "currentUser";

function readUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

const currentUser = ref(readUser());

export function useAuth() {
  const isAuthenticated = computed(() => currentUser.value !== null);

  function setUser(user) {
    currentUser.value = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  async function login(email, password) {
    const normalized = String(email || "").trim().toLowerCase();
    const users = await usersApi.findByEmail(normalized);
    const user = users.find((u) => String(u.password) === String(password));
    if (!user) return null;
    setUser(user);
    return user;
  }

  async function register(name, email, password) {
    const normalized = String(email || "").trim().toLowerCase();
    const existing = await usersApi.findByEmail(normalized);
    if (existing.length) {
      throw new Error("Пользователь с таким email уже существует");
    }
    return usersApi.create({ name, email: normalized, password });
  }

  return { currentUser, isAuthenticated, login, register, logout };
}
