document.addEventListener("DOMContentLoaded", () => {
    initLoginPage();
    initRegisterPage();
});

function initLoginPage() {
    const form = document.getElementById("loginForm");
    if (!form) {
        return;
    }

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const rememberInput = document.getElementById("rememberMe");
    const formAlert = document.getElementById("loginAlert");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideAlert(formAlert);

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        let isValid = true;
        isValid = validateRequired(emailInput, email, "Укажите email.") && isValid;
        isValid = validateEmail(emailInput, email) && isValid;
        isValid = validateRequired(passwordInput, password, "Введите пароль.") && isValid;
        isValid = validateMinLength(passwordInput, password, 6, "Пароль должен содержать минимум 6 символов.") && isValid;

        if (!isValid) {
            form.classList.add("was-validated");
            return;
        }

        try {
            const user = await TravelApi.login(email, password);

            if (!user) {
                showAlert(formAlert, "Пользователь с такими данными не найден. Проверьте email и пароль или зарегистрируйтесь.", "danger");
                passwordInput.classList.add("is-invalid");
                return;
            }

            TravelApp.setCurrentUser(user);
            TravelApp.syncAuthNavigation();
            showAlert(formAlert, "Вход выполнен успешно. Переходим в личный кабинет...", "success");
            TravelApp.showToast("Вход выполнен успешно", "success");

            window.setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1200);
        } catch (error) {
            showAlert(formAlert, "Ошибка соединения с сервером. Попробуйте позже.", "danger");
            console.error("Ошибка при входе:", error);
        }
    });
}

function initRegisterPage() {
    const form = document.getElementById("registerForm");
    if (!form) {
        return;
    }

    const successModalElement = document.getElementById("registerSuccessModal");
    const successModal = successModalElement ? new bootstrap.Modal(successModalElement) : null;
    const fields = {
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("registerEmail"),
        password: document.getElementById("registerPassword"),
        confirmPassword: document.getElementById("confirmPassword"),
        agreement: document.getElementById("agreeRules")
    };

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            firstName: fields.firstName.value.trim(),
            lastName: fields.lastName.value.trim(),
            email: fields.email.value.trim(),
            password: fields.password.value.trim(),
            confirmPassword: fields.confirmPassword.value.trim(),
            agreement: fields.agreement.checked
        };

        let isValid = true;
        isValid = validateRequired(fields.firstName, payload.firstName, "Введите имя.") && isValid;
        isValid = validateRequired(fields.lastName, payload.lastName, "Введите фамилию.") && isValid;
        isValid = validateRequired(fields.email, payload.email, "Укажите email.") && isValid;
        isValid = validateEmail(fields.email, payload.email) && isValid;
        isValid = validateRequired(fields.password, payload.password, "Введите пароль.") && isValid;
        isValid = validateMinLength(fields.password, payload.password, 6, "Пароль должен содержать минимум 6 символов.") && isValid;
        isValid = validateRequired(fields.confirmPassword, payload.confirmPassword, "Повторите пароль.") && isValid;
        isValid = validatePasswordMatch(fields.confirmPassword, payload.password, payload.confirmPassword) && isValid;
        isValid = validateCheckbox(fields.agreement, payload.agreement, "Необходимо согласиться с правилами.") && isValid;

        if (!isValid) {
            form.classList.add("was-validated");
            return;
        }

        try {
            const user = await TravelApi.register({
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                preference: "mixed"
            });

            TravelApp.setCurrentUser(user);
            TravelApp.syncAuthNavigation();
            TravelApp.showToast("Регистрация завершена", "success");

            if (successModal) {
                successModal.show();
            }

            form.reset();
            form.classList.remove("was-validated");
            clearValidationState(form);
        } catch (error) {
            TravelApp.showToast(error.message || "Ошибка при регистрации", "error");
            console.error("Ошибка при регистрации:", error);
        }
    });
}

function validateRequired(field, value, message) {
    const isValid = Boolean(value);
    setFieldState(field, isValid, message);
    return isValid;
}

function validateEmail(field, value) {
    if (!value) {
        return false;
    }
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = pattern.test(value);
    setFieldState(field, isValid, "Введите корректный email.");
    return isValid;
}

function validateMinLength(field, value, minLength, message) {
    if (!value) {
        return false;
    }
    const isValid = value.length >= minLength;
    setFieldState(field, isValid, message);
    return isValid;
}

function validatePasswordMatch(field, password, confirmPassword) {
    const isValid = Boolean(password) && password === confirmPassword;
    setFieldState(field, isValid, "Пароли должны совпадать.");
    return isValid;
}

function validateCheckbox(field, checked, message) {
    const isValid = Boolean(checked);
    field.classList.toggle("is-invalid", !isValid);
    field.classList.toggle("is-valid", isValid);

    const feedback = field.parentElement.querySelector(".invalid-feedback");
    if (feedback) {
        feedback.textContent = message;
    }
    return isValid;
}

function setFieldState(field, isValid, message) {
    const feedback = field.parentElement.querySelector(".invalid-feedback")
        || field.closest(".col-md-6, .col-12, .mb-3, .mb-4")?.querySelector(".invalid-feedback");

    field.classList.toggle("is-valid", isValid);
    field.classList.toggle("is-invalid", !isValid);

    if (!isValid && feedback) {
        feedback.textContent = message;
    }
}

function clearValidationState(form) {
    form.querySelectorAll(".is-valid, .is-invalid").forEach((field) => {
        field.classList.remove("is-valid", "is-invalid");
    });
}

function showAlert(container, message, type) {
    if (!container) {
        return;
    }
    container.className = `alert alert-${type}`;
    container.textContent = message;
    container.classList.remove("d-none");
}

function hideAlert(container) {
    if (!container) {
        return;
    }
    container.classList.add("d-none");
}
