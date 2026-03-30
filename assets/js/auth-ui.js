import { getCurrentUser, logoutUser, isAuthenticated } from './auth-service.js';

export function updateHeaderAuthUI() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const user = getCurrentUser();

    if (isAuthenticated() && user) {
        const loginLink = nav.querySelector('a[href="login.html"]');
        const registerLink = nav.querySelector('a[href="register.html"]');

        if (loginLink) {
            loginLink.textContent = 'Выйти';
            loginLink.href = '#';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                logoutUser();
                window.location.href = 'index.html';
            });
        }

        if (registerLink) {
            registerLink.textContent = user.name || 'Профиль';
            registerLink.href = 'profile.html';
        }
    }
}