import { registerUser } from './auth-service.js';

export function initRegisterPage() {
    const form = document.querySelector('form');
    if (!form) return;

    const textInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInputs = form.querySelectorAll('input[type="password"]');
    const submitButton = form.querySelector('.btn');

    if (!textInput || !emailInput || passwordInputs.length < 2 || !submitButton) return;

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = textInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInputs[0].value.trim();
        const confirmPassword = passwordInputs[1].value.trim();

        if (!name || !email || !password || !confirmPassword) {
            alert('Заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }

        try {
            const result = await registerUser({ name, email, password });
            console.log(result);
            window.location.href = 'profile.html';
        } catch (error) {
            console.error(error);
            alert('Не удалось зарегистрироваться');
        }
    });
}