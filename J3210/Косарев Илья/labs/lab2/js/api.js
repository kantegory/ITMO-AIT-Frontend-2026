const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' }
});

const getStoredToken = () => localStorage.getItem('jwt_token') || '';
const getStoredUser = () => JSON.parse(localStorage.getItem('user_info') || 'null');

function getUserDisplayName(user) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.username || user.email;
}

function saveAuthSession(token, user) {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_info', JSON.stringify(user));
}

function clearAuthSession() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
}

function enforceProtectedRoutes() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if ((page === 'index.html' || page === 'subscriptions.html') && !getStoredToken()) {
        window.location.href = 'register.html';
        return false;
    }
    return true;
}

function bindLogoutButtons() {
    const logoutLinks = document.querySelectorAll('#userMenuDropdown a[href="login.html"]');
    logoutLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            clearAuthSession();
            window.location.href = 'register.html';
        });
    });
}

function applyUserInfoToPage() {
    const user = getStoredUser();
    if (!user) return;

    const displayName = getUserDisplayName(user);

    const headerUserName = document.querySelector('#userMenuToggle span');
    if (headerUserName) headerUserName.textContent = displayName;

    const profileName = document.getElementById('profileName');
    if (profileName) profileName.textContent = displayName;
}

api.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

window.authSession = {
    getStoredUser,
    getStoredToken,
    saveAuthSession,
    clearAuthSession,
    applyUserInfoToPage,
    enforceProtectedRoutes
};

window.addEventListener('DOMContentLoaded', () => {
    if (!enforceProtectedRoutes()) {
        return;
    }

    applyUserInfoToPage();
    bindLogoutButtons();
});