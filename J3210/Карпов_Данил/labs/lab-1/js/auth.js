/**
 * auth.js — общий модуль авторизации для Minion Courses
 * Управляет токеном, данными пользователя и состоянием навбара
 */

const API_URL = 'http://localhost:3001';

// ─── Token helpers ────────────────────────────────────────────────────────────

function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    localStorage.setItem('token', token);
}

function removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
}

function isLoggedIn() {
    return !!getToken();
}

// ─── User helpers ─────────────────────────────────────────────────────────────

function getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    try {
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Ошибка ${response.status}`);
    }

    return data;
}

// ─── Auth actions ─────────────────────────────────────────────────────────────

async function register(name, email, password, role = 'student') {
    const data = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });
    setToken(data.token);
    setCurrentUser(data.user);
    return data;
}

async function login(email, password) {
    const data = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    setToken(data.token);
    setCurrentUser(data.user);
    return data;
}

function logout() {
    removeToken();
    window.location.href = 'login.html';
}

// ─── Navbar updater ───────────────────────────────────────────────────────────

function updateNavbar() {
    const user = getCurrentUser();
    const loggedIn = isLoggedIn() && user;

    // Кнопки "Войти" и "Регистрация"
    const authButtons = document.getElementById('authButtons');
    // Дропдаун пользователя
    const userDropdown = document.getElementById('userDropdown');

    if (!authButtons && !userDropdown) return;

    if (loggedIn) {
        if (authButtons) {
            authButtons.classList.add('d-none');
        }
        if (userDropdown) {
            userDropdown.classList.remove('d-none');
            userDropdown.style.removeProperty('display');
            const nameEl = document.getElementById('userDropdownName');
            if (nameEl) nameEl.textContent = user.name;
            // Обновляем aria-label кнопки дропдауна с именем пользователя
            const toggleBtn = userDropdown.querySelector('[data-bs-toggle="dropdown"]');
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-label', `Меню пользователя ${user.name}`);
            }
        }
    } else {
        if (authButtons) {
            authButtons.classList.remove('d-none');
        }
        if (userDropdown) {
            userDropdown.classList.add('d-none');
        }
    }
}

// ─── Logout modal handler ─────────────────────────────────────────────────────

function initLogoutButton() {
    const logoutBtn = document.getElementById('logoutConfirmBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }
}

// ─── Init on DOMContentLoaded ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    initLogoutButton();
});
