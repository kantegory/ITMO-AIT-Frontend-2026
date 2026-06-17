const API_URL = 'http://localhost:3000';

function getAuthToken() {
    return localStorage.getItem('accessToken');
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = "login.html";
}

async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? {'Authorization': `Bearer ${token}`} : {}),
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {...options, headers});
        if (response.status === 401) {
            logout();
            return null;
        }
        return await response.json();
    } catch (e) {
        console.error("Ошибка API:", e);
        return null;
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    document.body.dataset.theme = savedTheme;
}

function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.body.dataset.theme = newTheme;
    localStorage.setItem('app-theme', newTheme);
}

document.addEventListener("DOMContentLoaded", initTheme);