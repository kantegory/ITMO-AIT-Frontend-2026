export function initAuth() {
    handleRegistration();
    handleLogin();
}

function handleRegistration() {
    const registerForm = document.getElementById("registerForm")

    if (!registerForm) return;

    const passwordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("regPasswordConfirm");
    const registerBtn = document.getElementById("registerBtn");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let isValid = true;

        if (!registerForm.checkValidity()) {
            isValid = false;
        }

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Пароли не совпадают");
            isValid = false;
        } else {
            confirmPasswordInput.setCustomValidity("");
        }

        registerForm.classList.add("was-validated");

        if (isValid) {
            const originalText = registerBtn.innerHTML;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Создаем аккаунт...';
            registerBtn.disabled = true;

            setTimeout(() => {
                registerBtn.innerHTML = originalText;
                registerBtn.disabled = false;

                alert("Регистрация прошла успешно! Теперь вы можете войти.")

                registerForm.reset();
                registerForm.classList.remove("was_validated");
            }, 1500);
        }
    });

    confirmPasswordInput.addEventListener("input", function() {
        if (passwordInput.value === confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("");
        }
    });
}

function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const loginBtn = document.getElementById("loginBtn");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!loginForm.checkValidity()) {
            loginForm.classList.add("was-validated");
            return;
        }

        loginForm.classList.add("was-validated");

        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Вход...';
        loginBtn.disabled = true;

        setTimeout(() => {
            loginBtn.innerHTML = originalText;
            loginBtn.disabled = false;
            
            alert("Успешный вход!");
            
            window.location.href = "dashboard.html";
            
        }, 1000);
    });
}