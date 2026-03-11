export function initAuth() {
    handleRegistration();
    handleLogin();
}

function getUsers() {
    return JSON.parse(localStorage.getItem("edu_users")) || [];
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("edu_users", JSON.stringify(users))
}

function handleRegistration() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    const firstNameInput = document.getElementById("regFirstName");
    const lastNameInput = document.getElementById("regLastName");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const confirmPasswordInput = document.getElementById("regPasswordConfirm");
    const registerBtn = document.getElementById("registerBtn");

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Пароли не совпадают");
        } else {
            confirmPasswordInput.setCustomValidity("");
        }

        const users = getUsers();
        if (users.some(u => u.email === emailInput.value)) {
            emailInput.setCustomValidity("Email уже занят");
        } else {
            emailInput.setCustomValidity("");
        }

        registerForm.classList.add("was-validated");

        if (registerForm.checkValidity()) {
            const originalText = registerBtn.innerHTML;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Регистрация...';
            registerBtn.disabled = true;

            saveUser({
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                courses: [],
                certificates: []
            });

            registerBtn.innerHTML = originalText;
            registerBtn.disabled = false;

            alert("Успешно! Теперь вы можете войти");
            window.location.href = "login.html";
        }
    });

    confirmPasswordInput.addEventListener("input", () => confirmPasswordInput.setCustomValidity(""));
    emailInput.addEventListener("input", () => emailInput.setCustomValidity(""));
}

function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const loginBtn = document.getElementById("loginBtn");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        emailInput.setCustomValidity("");
        passwordInput.setCustomValidity("");

        loginForm.classList.add("was-validated")

        if (loginForm.checkValidity()) {
            const originalText = loginBtn.innerHTML;
            loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Проверка...';
            loginBtn.disabled = true;

            const users = getUsers();
            const foundUser = users.find(u => u.email === emailInput.value && u.password === passwordInput.value);

            if (foundUser) {
                localStorage.setItem("edu_current_user", JSON.stringify(foundUser));
                window.location.href = "dashboard.html";
            } else {
                loginBtn.innerHTML = originalText;
                loginBtn.disabled = false;

                passwordInput.setCustomValidity("Неверный email или пароль")
                loginForm.reportValidity();
            }
        }
    });

    emailInput.addEventListener("input", () => passwordInput.setCustomValidity(""));
    passwordInput.addEventListener("input", () => passwordInput.setCustomValidity(""));
}