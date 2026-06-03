// js/api.js
const API_BASE = 'http://localhost:3000';

export function getToken() {
    return localStorage.getItem('accessToken');
}

export function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

export function setAuthData(token, user) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
}

export function isAuthenticated() {
    return !!getToken();
}

export async function register(userData) {
    const response = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'Ошибка регистрации');
    }

    const data = await response.json();
    setAuthData(data.accessToken, data.user);
    return data;
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || error.message || 'Неверный email или пароль');
    }

    const data = await response.json();
    setAuthData(data.accessToken, data.user);
    return data;
}

export function logout() {
    clearAuthData();
    window.location.href = 'index.html';
}