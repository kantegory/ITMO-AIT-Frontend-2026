import { postJSON, getJSON, saveCurrentUser } from './api.js';

const nameInput = document.querySelector('#floatingName');
const surnameInput = document.querySelector('#floatingSurname');
const emailInput = document.querySelector('#floatingEmail');
const passInput = document.querySelector('#floatingPassword');
const passRepeatInput = document.querySelector('#floatingPasswordRepeat');
const btnRegister = document.querySelector('#btnRegister');

const errorToastEl = document.getElementById('errorToast');
const errorText = document.getElementById('errorToastText');
const successToastEl = document.getElementById('successToast');
const successText = document.getElementById('successToastText');

const errorToast = new bootstrap.Toast(errorToastEl);
const successToast = new bootstrap.Toast(successToastEl);

function showError(message) {
    errorText.textContent = message;
    errorToast.show();
}

function showSuccess(message) {
    successText.textContent = message;
    successToast.show();
}

function clearForm() {
    [nameInput, surnameInput, emailInput, passInput, passRepeatInput].forEach(i => i.value = '');
}

async function handleRegister() {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    const passwordRepeat = passRepeatInput.value.trim();
    
    if (!name || !surname || !email || !password || !passwordRepeat) {
        return showError('Заполните все поля');
    }
    if (password.length < 6) {
        return showError('Пароль минимум 6 символов');
    }
    if (password !== passwordRepeat) {
        passRepeatInput.value = '';
        return showError('Пароли не совпадают');
    }

    const users = await getJSON('/users', { email });
    if (users.length > 0) {
        emailInput.value = '';
        return showError('Этот email уже зарегистрирован');
    }

    try {
        const newUser = await postJSON('/users', { name, surname, email, password });
        saveCurrentUser({ id: newUser.id, email, name, surname });
        showSuccess('Регистрация успешна!');
        clearForm();
        setTimeout(() => window.location.href = 'login.html', 1200);
    } catch (err) {
        showError(err.message || 'Ошибка регистрации');
    }
}

btnRegister.addEventListener('click', handleRegister);

[nameInput, surnameInput, emailInput, passInput, passRepeatInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRegister();
        }
    });
});