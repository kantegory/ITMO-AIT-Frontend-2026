import { getJSON, saveCurrentUser } from './api.js';

const emailInputEnter = document.querySelector('#floatingInput');
const passwordInputEnter = document.querySelector('#floatingPassword');
const entBtn = document.querySelector('#enter');
const loginForm = document.querySelector('#loginForm');

const toastElement = document.getElementById('errorToast');
const toastText = document.getElementById('errorToastText');
const errorToast = new bootstrap.Toast(toastElement);

function showToast(message) {
    toastText.textContent = message;
    errorToast.show();
}

function clearInputs() {
    emailInputEnter.value = '';
    passwordInputEnter.value = '';
}

async function checkLoginEnter() {
    const queryEmail = emailInputEnter.value.trim();
    const queryPassword = passwordInputEnter.value.trim();

    if (queryEmail === '' || queryPassword === '') {
        showToast('Пустые значения');
        clearInputs();
        return;
    }

    try {
        const users = await getJSON('/users', {
            email: queryEmail,
            password: queryPassword
        });

        if (!users.length) {
            showToast('Неверный логин или пароль');
            clearInputs();
            return;
        }

        saveCurrentUser(users[0]);
        window.location.href = 'main.html';
    } catch (error) {
        console.error(error);
        showToast('Не удалось подключиться к API');
    }
}

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    checkLoginEnter();
});
