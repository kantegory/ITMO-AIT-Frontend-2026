import api from './api';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'currentUser';

function saveSession(data) {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

export async function registerUser(payload) {
  const { data } = await api.post('/register', payload);
  saveSession(data);
  return data.user;
}

export async function loginUser(payload) {
  const { data } = await api.post('/login', payload);
  saveSession(data);
  return data.user;
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}
