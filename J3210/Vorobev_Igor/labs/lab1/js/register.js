const nameInput = document.querySelector('#floatingName');
const surnameInput = document.querySelector('#floatingSurname');
const emailInput = document.querySelector('#floatingEmail');
const passInput = document.querySelector('#floatingPassword');
const passRepeatInput = document.querySelector('#floatingPasswordRepeat');
const btnRegister = document.querySelector('#btnRegister');

const errorToastEl = document.getElementById('errorToast');
const errorText = document.getElementById('errorToastText');
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

function CheckDataBase(usersArray, email) {
    return usersArray.some(user => user.email === email);
}

function handleRegister() {
    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value.trim();
    const passwordRepeat = passRepeatInput.value.trim();
    
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUsers = [...([]), ...localUsers];
    
    if (!name || !surname || !email || !password || !passwordRepeat) {
        showError('Заполните все поля');
        clearForm();
        return;
    }
    
    if (password.length < 6) {
        showError('Пароль минимум 6 символов');
        passInput.focus();
        return;
    }
    
    if (password !== passwordRepeat) {
        showError('Пароли не совпадают');
        passRepeatInput.value = '';
        passRepeatInput.focus();
        return;
    }
    
    if (CheckDataBase(allUsers, email)) {
        showError('Этот email уже зарегистрирован');
        emailInput.value = '';
        emailInput.focus();
        return;
    }
    
    const newUser = {
        name,
        surname,
        email,
        password
    };
    
    localUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(localUsers));

    window.location.href = 'login.html';
}

btnRegister.addEventListener('click', handleRegister);

[ nameInput, surnameInput, emailInput, passInput, passRepeatInput ].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRegister();
        }
    });
});