export function initAuth() {
    handleRegistration();
    handleLogin();
}

function handleRegistration() {
    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        const passwordInput = document.getElementById("regPassword");
        const confirmPasswordInput = document.getElementById("regPasswordConfirm");
        confirmPasswordInput.setCustomValidity("");

        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Пароли не совпадают");
        }

        registerForm.classList.add("was-validated");

        if (registerForm.checkValidity()) {
            const registerBtn = document.getElementById("registerBtn");
            registerBtn.disabled = true;
            registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

            const userData = {
                firstName: document.getElementById("regFirstName").value,
                lastName: document.getElementById("regLastName").value,
                email: document.getElementById("regEmail").value,
                password: passwordInput.value,
                courses: [],
                certificates: []
            };

            try {
                const response = await fetch('http://127.0.0.1:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                if (response.ok) {
                    window.location.href = "login.html"; 
                    alert("Регистрация успешна!");
                } else {
                    const errorData = await response.json();
                    alert("Ошибка: " + (errorData || "Email уже занят"));
                }
            } catch (error) {
                alert("Нет связи с сервером");
            } finally {
                registerBtn.disabled = false;
                registerBtn.innerHTML = 'Зарегистрироваться';
            }
        }
    });

    document.getElementById("regPasswordConfirm").addEventListener("input", function() { this.setCustomValidity(""); });
}

function handleLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const loginBtn = document.getElementById("loginBtn");

    passwordInput.addEventListener("input", () => {
        passwordInput.setCustomValidity("");
        loginForm.classList.remove("was-validated");
    });

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        
        passwordInput.setCustomValidity("");

        if (!loginForm.checkValidity()) {
            loginForm.classList.add("was-validated");
            return;
        }

        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
        loginBtn.disabled = true;

        try {
            const response = await fetch('http://127.0.0.1:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value
                })
            });

            if (response.ok) {
                const { accessToken, user } = await response.json();
                user.password = passwordInput.value; 
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("user", JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                passwordInput.setCustomValidity("Неверный пароль");
                loginForm.classList.add("was-validated");
                loginForm.reportValidity(); 
            }
        } catch (error) {
            alert("Ошибка сети");
        } finally {
            loginBtn.innerHTML = 'Войти';
            loginBtn.disabled = false;
        }
    });
}