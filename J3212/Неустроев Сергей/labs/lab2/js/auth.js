// ЛР2 — авторизация через json-server-auth (эндпоинты /register и /login)
import { API_URL } from './api.js';

// Регистрация: возвращает { accessToken, user }
export async function register({ email, password, name }) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) throw new Error('Не удалось зарегистрироваться');
  const data = await res.json();
  saveSession(data);
  return data;
}

// Вход: возвращает { accessToken, user }
export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Неверный e-mail или пароль');
  const data = await res.json();
  saveSession(data);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function currentUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

// Защита страниц: вызвать в начале скрипта страницы кабинета
export function requireAuth(redirect = 'login.html') {
  if (!localStorage.getItem('token')) window.location.href = redirect;
}

function saveSession(data) {
  localStorage.setItem('token', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
}
