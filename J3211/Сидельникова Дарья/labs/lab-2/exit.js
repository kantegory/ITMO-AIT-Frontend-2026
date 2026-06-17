import { loginRequest, registerRequest } from "./api.js";

export function togglePassword(id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
}

export function initPasswordStrength() {
    const password = document.getElementById("password");
    const strengthBar = document.getElementById("strengthBar");

    password?.addEventListener("input", function () {
        const value = password.value;
        let strength = 0;

        const ruleLength = document.getElementById("ruleLength");
        const ruleNumber = document.getElementById("ruleNumber");

        if (value.length >= 8) {
            ruleLength?.classList.add("rule-valid");
            strength++;
        } else {
            ruleLength?.classList.remove("rule-valid");
        }

        if (/\d/.test(value)) {
            ruleNumber?.classList.add("rule-valid");
            strength++;
        } else {
            ruleNumber?.classList.remove("rule-valid");
        }

        if (!strengthBar) return;

        if (strength === 0) {
            strengthBar.style.width = "0%";
            strengthBar.style.background = "transparent";
        } else if (strength === 1) {
            strengthBar.style.width = "50%";
            strengthBar.style.background = "orange";
        } else {
            strengthBar.style.width = "100%";
            strengthBar.style.background = "green";
        }
    });
}

export function initConfirmPasswordValidation() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    confirmPassword?.addEventListener("input", function () {
        const passwordValue = password?.value || "";
        const confirmValue = confirmPassword.value;
        const confirmError = document.getElementById("confirmError");

        if (!confirmError) return;

        if (confirmValue !== passwordValue) {
            confirmError.textContent = "Пароли не совпадают";
        } else {
            confirmError.textContent = "";
        }
    });
}

export function initRegisterPage() {
    initPasswordStrength();
    initConfirmPasswordValidation();
    window.togglePassword = togglePassword;

    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        const nameError = document.getElementById("nameError");
        const emailError = document.getElementById("emailError");
        const passwordError = document.getElementById("passwordError");
        const confirmError = document.getElementById("confirmError");

        if (nameError) nameError.textContent = "";
        if (emailError) emailError.textContent = "";
        if (passwordError) passwordError.textContent = "";
        if (confirmError) confirmError.textContent = "";

        if (!name) {
            if (nameError) nameError.textContent = "Введите имя";
            return;
        }

        if (!email) {
            if (emailError) emailError.textContent = "Введите email";
            return;
        }

        if (password.length < 8) {
            if (passwordError) passwordError.textContent = "Пароль должен содержать минимум 8 символов";
            return;
        }

        if (!/\d/.test(password)) {
            if (passwordError) passwordError.textContent = "Пароль должен содержать хотя бы 1 цифру";
            return;
        }

        if (password !== confirmPassword) {
            if (confirmError) confirmError.textContent = "Пароли не совпадают";
            return;
        }

        try {
            const newUser = await registerRequest({
                name,
                email,
                password,
                avatar: "https://i.pravatar.cc/150?img=12"
            });

            localStorage.setItem("currentUser", JSON.stringify(newUser));
            localStorage.setItem("token", "fake-token");

            alert("Регистрация успешна");
            window.location.href = "../base/dashboard.html";
        } catch (error) {
            if (emailError) {
                emailError.textContent = error.message;
            } else {
                alert(error.message);
            }
            console.error(error);
        }
    });
}

export function initLoginPage() {
    window.togglePassword = togglePassword;

    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const passwordError = document.getElementById("passwordError");

        if (passwordError) {
            passwordError.textContent = "";
        }

        try {
            const user = await loginRequest(email, password);

            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.setItem("token", "fake-token");

            window.location.href = "../base/dashboard.html";
        } catch (error) {
            if (passwordError) {
                passwordError.textContent = error.message;
            }
        }
    });
}