import { apiRequest } from './api.js';

const TOKEN_KEY = 'accessToken';
const USER_KEY = 'currentUser';

export async function registerUser({ email, password, name }) {
    const data = await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
    });

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
}

export async function loginUser({ email, password }) {
    const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));

    return data;
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