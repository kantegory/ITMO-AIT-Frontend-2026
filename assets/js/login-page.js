import { loginUser } from './auth-service.js';

export function initLoginPage() {
    const form = document.querySelector('form');
    if (!form) return;

    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const submitButton = form.querySelector('.btn');

    if (!emailInput || !passwordInput || !submitButton) return;

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Пожалуйста, заполните email и пароль');
            return;
        }

        try {
            await loginUser({ email, password });
            window.location.href = 'profile.html';
        } catch (error) {
            console.error(error);
            alert('Неверный логин или пароль');
        }
    });
}