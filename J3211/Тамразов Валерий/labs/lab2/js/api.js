var API_URL = 'http://localhost:3000';

function getToken() {
    return localStorage.getItem('accessToken');
}

function getUser() {
    var userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

function isLoggedIn() {
    return !!getToken();
}

function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
    };
}

function checkAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

function updateNavbar() {
    var authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    if (isLoggedIn()) {
        var user = getUser();

        authButtons.textContent = '';

        var emailSpan = document.createElement('span');
        emailSpan.className = 'navbar-text me-2';
        emailSpan.style.color = 'var(--text-secondary)';
        emailSpan.textContent = user ? user.email : '';
        authButtons.appendChild(emailSpan);

        var logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn btn-outline-danger btn-sm';
        logoutBtn.textContent = 'Выйти';
        logoutBtn.addEventListener('click', logout);
        authButtons.appendChild(logoutBtn);
    } else {
        authButtons.textContent = '';

        var loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.className = 'btn btn-outline-light btn-sm';
        loginLink.textContent = 'Войти';
        authButtons.appendChild(loginLink);

        var regLink = document.createElement('a');
        regLink.href = 'register.html';
        regLink.className = 'btn btn-primary btn-sm';
        regLink.textContent = 'Регистрация';
        authButtons.appendChild(regLink);
    }
}
