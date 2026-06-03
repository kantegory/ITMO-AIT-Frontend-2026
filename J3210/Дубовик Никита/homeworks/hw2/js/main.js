import {
    login,
    register,
    logout,
    isAuthenticated,
    getUser,
    getToken
} from './api.js';

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-bs-theme', savedTheme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', savedTheme === 'dark');
    }
}

function toggleTheme() {
    const current = htmlElement.getAttribute('data-bs-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if (themeToggle) {
        themeToggle.setAttribute('aria-pressed', newTheme === 'dark');
    }
}

function updateAuthUI() {
    const authButtons = document.querySelector('.d-flex.align-items-center.gap-2.ms-lg-1');
    const accountDropdown = document.querySelector('.dropdown.position-relative.me-3');

    if (isAuthenticated()) {
        if (authButtons) authButtons.style.display = 'none';
        if (accountDropdown) accountDropdown.style.display = 'block';

        const user = getUser();
        const profileLink = document.querySelector('#accountDropdown span.fw-medium');
        if (profileLink && user) {
            profileLink.textContent = `${user.firstName} ${user.lastName}`;
        }

        if (window.location.pathname.includes('profile.html')) {
            loadProfileData();
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (accountDropdown) accountDropdown.style.display = 'none';

        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'index.html';
        }
    }
}

function setupPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('use');

            if (input && icon) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                icon.setAttribute('href', isPassword ? '#icon-eye-slash' : '#icon-eye');
                this.setAttribute('aria-label', isPassword ? 'Скрыть пароль' : 'Показать пароль');
            }
        });
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 6) {
        score += 1;
    }
    if (password.length >= 10) {
        score += 1;
    }
    if (/[a-z]/.test(password)) {
        score += 1;
    }
    if (/[A-Z]/.test(password)) {
        score += 1;
    }
    if (/[0-9]/.test(password)) {
        score += 1;
    }
    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1;
    }

    return {
        score,
        percent: Math.min(100, score * 16.67)
    };
}

function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        if (!strengthBar || !strengthText) return;

        const strength = calculatePasswordStrength(password);

        strengthBar.style.width = `${strength.percent}%`;
        strengthBar.className = 'strength-bar';

        if (strength.percent < 30) {
            strengthBar.classList.add('bg-danger');
            strengthText.textContent = 'Слабый пароль';
            strengthText.className = 'strength-text text-danger';
        } else if (strength.percent < 70) {
            strengthBar.classList.add('bg-warning');
            strengthText.textContent = 'Средний пароль';
            strengthText.className = 'strength-text text-warning';
        } else {
            strengthBar.classList.add('bg-success');
            strengthText.textContent = 'Надёжный пароль';
            strengthText.className = 'strength-text text-success';
        }
    });
}

function setupEventListeners() {
    // Форма входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Кнопка выхода
    const logoutLink = document.querySelector('a.dropdown-item.text-danger');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Переключатель темы
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Фокус на email при открытии модального окна
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.addEventListener('shown.bs.modal', () => {
            document.getElementById('loginEmail')?.focus();
        });
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');

    try {
        await login(email, password);

        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal?.hide();

        loginForm?.reset();
        updateAuthUI();
        showToast('Успешный вход!', 'success');

        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message, 'error');

        if (error.message.includes('email') || error.message.includes('Email')) {
            emailInput.classList.add('is-invalid');
        } else {
            passwordInput.classList.add('is-invalid');
        }
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const registerForm = document.getElementById('registerForm');
    const nameInput = document.getElementById('registerName');
    const surnameInput = document.getElementById('registerSurname');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmInput = document.getElementById('registerConfirm');
    const agreeCheckbox = document.getElementById('agreeTerms');

    [nameInput, surnameInput, emailInput, passwordInput, confirmInput].forEach(el => {
        el?.classList.remove('is-invalid');
    });

    if (passwordInput.value !== confirmInput.value) {
        confirmInput.classList.add('is-invalid');
        showToast('Пароли не совпадают', 'error');
        return;
    }

    if (!agreeCheckbox.checked) {
        showToast('Необходимо принять условия использования', 'error');
        return;
    }

    const userData = {
        email: emailInput.value.trim(),
        password: passwordInput.value,
        firstName: nameInput.value.trim(),
        lastName: surnameInput.value.trim()
    };

    try {
        await register(userData);

        const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
        modal?.hide();

        registerForm?.reset();
        updateAuthUI();
        showToast('Регистрация успешна! Добро пожаловать!', 'success');

        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Register error:', error);
        showToast(error.message, 'error');

        if (error.message.includes('email') || error.message.includes('Email')) {
            emailInput.classList.add('is-invalid');
        }
    }
}

function handleLogout() {
    if (confirm('Вы действительно хотите выйти?')) {
        logout();
        showToast('Вы вышли из аккаунта', 'info');
    }
}

async function loadProfileData() {
    const userNameEl = document.getElementById('userName');
    const userEmailEl = document.getElementById('userEmail');
    const avatarInitialsEl = document.getElementById('avatarInitials');

    const user = getUser();
    if (!user) return;

    if (userNameEl) {
        userNameEl.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (userEmailEl) {
        userEmailEl.textContent = user.email;
    }
    if (avatarInitialsEl) {
        avatarInitialsEl.textContent = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
}

function showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1100';
        document.body.appendChild(toastContainer);
    }

    const toastId = `toast-${Date.now()}`;
    const bgClass = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-primary',
        warning: 'bg-warning'
    }[type] || 'bg-primary';

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
}

window.VitalCourses = {
    auth: {
        isAuthenticated,
        getToken,
        getUser,
        login,
        register,
        logout
    },
    ui: {
        showToast
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    updateAuthUI();
    setupEventListeners();
    setupPasswordToggle();
    setupPasswordStrength();
});