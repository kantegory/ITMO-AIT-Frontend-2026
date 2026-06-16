import { getJSON, postJSON, saveCurrentUser } from './api.js';

const emailInputRegister = document.querySelector('#floatingInputRegister');
const passwordInputRegister = document.querySelector('#floatingPasswordRegister');
const passwordInputRepeatRegister = document.querySelector('#floatingPasswordRepeatRegister');
const nameInput = document.querySelector('#floatingName');
const surnameInput = document.querySelector('#floatingSurname');
const entBtnReg = document.querySelector('#enterRegister');
const registerForm = document.querySelector('#registerForm');

const toastElement = document.getElementById('errorToast');
const toastText = document.getElementById('errorToastText');
const errorToast = new bootstrap.Toast(toastElement);

function showToast(message) {
    toastText.textContent = message;
    errorToast.show();
}

function clearInputs() {
    emailInputRegister.value = '';
    passwordInputRegister.value = '';
    passwordInputRepeatRegister.value = '';
    nameInput.value = '';
    surnameInput.value = '';
}

async function checkLoginInBase() {
    const queryEmail = emailInputRegister.value.trim();
    const queryPassword = passwordInputRegister.value.trim();
    const repeatPassword = passwordInputRepeatRegister.value.trim();
    const queryName = nameInput.value.trim();
    const querySurname = surnameInput.value.trim();

    if (
        queryEmail === '' ||
        queryPassword === '' ||
        repeatPassword === '' ||
        queryName === '' ||
        querySurname === ''
    ) {
        showToast('Пустые значения');
        clearInputs();
        return;
    }

    if (queryPassword !== repeatPassword) {
        showToast('Пароли не совпадают');
        clearInputs();
        return;
    }

    try {
        const existingUsers = await getJSON('/users', { email: queryEmail });

        if (existingUsers.length) {
            showToast('Уже есть такой пользователь');
            clearInputs();
            return;
        }

        const newUser = await postJSON('/users', {
            name: queryName,
            surname: querySurname,
            email: queryEmail,
            password: queryPassword
        });

        saveCurrentUser(newUser);
        window.location.href = 'main.html';
    } catch (error) {
        console.error(error);
        showToast('Не удалось подключиться к API');
    }
}

registerForm.addEventListener('submit', function (event) {
    event.preventDefault();
    checkLoginInBase();
});
