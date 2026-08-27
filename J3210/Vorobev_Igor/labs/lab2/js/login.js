import { getJSON, saveCurrentUser } from './api.js';

const emailInput = document.getElementById('floatingEmail');
const passInput = document.getElementById('floatingPassword');
const btnLogin = document.getElementById('btnLogin');

const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
const successToast = new bootstrap.Toast(document.getElementById('successToast'));
const errorText = document.getElementById('errorToastText');
const successText = document.getElementById('successToastText');

btnLogin.addEventListener('click', async () => {
    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value.trim();

    if (!email || !password) {
        errorText.textContent = 'Заполните все поля';
        errorToast.show();
        return;
    }

    if (password.length < 6) {
        errorText.textContent = 'Пароль минимум 6 символов';
        errorToast.show();
        return;
    }

    try {
        const users = await getJSON('/users', { email });
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) throw new Error('Не найдено');

        saveCurrentUser({ id: user.id, email: user.email, name: user.name, surname: user.surname });
        
        successText.textContent = 'Добро пожаловать!';
        successToast.show();
        setTimeout(() => window.location.href = 'personal_account.html', 1000);
    } catch {
        errorText.textContent = 'Неверный email или пароль';
        errorToast.show();
    }
});