const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

function getStoredToken() {
    return localStorage.getItem('jwt_token') || '';
}

function getStoredUser() {
    try {
        const rawUser = localStorage.getItem('user_info');
        return rawUser ? JSON.parse(rawUser) : null;
    }
    catch {
        return null;
    }
}

function getUserDisplayName(user) {
    if (!user) {
        return '';
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
    return fullName || user.username || user.email || '';
}

function saveAuthSession(accessToken, user) {
    if (accessToken) {
        localStorage.setItem('jwt_token', accessToken);
    }

    if (user) {
        localStorage.setItem('user_info', JSON.stringify(user));
    }
}

function clearAuthSession() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
}

function getCurrentPageName() {
    const pageName = window.location.pathname.split('/').pop();
    return pageName || 'index.html';
}

function enforceProtectedRoutes() {
    const protectedPages = new Set(['index.html', 'subscriptions.html']);
    const pageName = getCurrentPageName();

    if (protectedPages.has(pageName) && !getStoredToken()) {
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
    const displayName = getUserDisplayName(user);

    if (!displayName) {
        return;
    }

    const headerUserName = document.querySelector('#userMenuToggle span');
    if (headerUserName) {
        headerUserName.textContent = displayName;
    }

    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.textContent = displayName;
    }
}

api.interceptors.request.use((config) => {
    const token = getStoredToken();

    if (token) {
        config.headers = config.headers || {};
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