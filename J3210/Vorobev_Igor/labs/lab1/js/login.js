const emailInput = document.getElementById('floatingEmail');
const passInput = document.getElementById('floatingPassword');
const btnLogin = document.getElementById('btnLogin');

const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
const successToast = new bootstrap.Toast(document.getElementById('successToast'));
const errorText = document.getElementById('errorToastText');
const successText = document.getElementById('successToastText');

btnLogin.addEventListener('click', () => {
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

    const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('taskflow_user', JSON.stringify({ name: user.name, email }));
        successText.textContent = `Добро пожаловать, ${user.name}!`;
        successToast.show();
        setTimeout(() => window.location.href = 'personal_account.html', 1000);
    } else {
        errorText.textContent = 'Неверный email или пароль';
        errorToast.show();
    }
});