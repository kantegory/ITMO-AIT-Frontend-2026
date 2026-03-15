document.addEventListener('DOMContentLoaded', function() {
    function setupFormLogic(formId, isLoginPage) {
        const formElement = document.getElementById(formId);

        if (!formElement) return;

        const emailInput = formElement.querySelector('input[type="email"]');
        const passwordInput = formElement.querySelector('input[type="password"]');
        const submitButton = formElement.querySelector('button');

        function validateFields() {
            const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
            const isPasswordValid = passwordInput.value.length >= 8;
            submitButton.disabled = !(isEmailValid && isPasswordValid);
        }

        emailInput.addEventListener('input', validateFields);
        passwordInput.addEventListener('input', validateFields);

        formElement.addEventListener('submit', function(event) {
            event.preventDefault();
            const userDatabase = JSON.parse(localStorage.getItem('USERS')) || {};
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value;

            if (isLoginPage) {
                if (userDatabase[emailValue] === passwordValue) {
                    localStorage.setItem('current_user', emailValue);
                    window.location.href = 'dashboard.html';
                } else {
                    alert('ОШИБКА: НЕВЕРНЫЙ ЛОГИН ИЛИ ПАРОЛЬ');
                }
            } else {
                if (userDatabase[emailValue]) {
                    alert('ОШИБКА: ПОЛЬЗОВАТЕЛЬ УЖЕ СУЩЕСТВУЕТ');
                } else {
                    userDatabase[emailValue] = passwordValue;
                    localStorage.setItem('USERS', JSON.stringify(userDatabase));
                    alert('УСПЕХ: АККАУНТ СОЗДАН!');
                    window.location.href = 'index.html';
                }
            }
        });
    }

    setupFormLogic('loginForm', true);
    setupFormLogic('registerForm', false);
});