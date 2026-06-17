import { ref, computed, readonly } from 'vue';

const AUTH_USER_KEY = 'projecthub_user';
const AUTH_TOKEN_KEY = 'projecthub_token';

function safeParse(raw) {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

const user = ref(safeParse(localStorage.getItem(AUTH_USER_KEY)));
const token = ref(localStorage.getItem(AUTH_TOKEN_KEY));

export function getToken() {
  return token.value;
}

export function isAuthenticated() {
  return !!user.value && !!token.value;
}

export function setAuth(nextUser, nextToken) {
  user.value = nextUser || null;
  token.value = nextToken || null;
  if (nextUser) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
  else localStorage.removeItem(AUTH_USER_KEY);
  if (nextToken) localStorage.setItem(AUTH_TOKEN_KEY, nextToken);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearAuth() {
  setAuth(null, null);
}

export function useAuth() {
  return {
    user: readonly(user),
    isAuthenticated: computed(() => !!user.value && !!token.value),
    setAuth,
    logout: clearAuth,
  };
}
