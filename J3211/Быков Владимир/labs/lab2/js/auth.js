import { request } from './api.js';

export function getSavedUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

export function getSavedToken() {
    return localStorage.getItem('token');
}

export function saveAuth(data) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));

    return {
        token: data.accessToken,
        user: data.user
    };
}

export function clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

export function login(email, password) {
    return request('/login', {
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    });
}

export function register(userData) {
    return request('/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}
