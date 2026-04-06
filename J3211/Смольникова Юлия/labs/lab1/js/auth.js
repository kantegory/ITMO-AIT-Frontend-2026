document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
    initRegisterForm();
});

function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const emailInput = form.querySelector('[name="email"]');
    const errorBox = form.querySelector("#formError");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        clearError(errorBox);

        if (!email) {
            showError(errorBox, "Введите email");
            return;
        }

        if (email.includes("teacher")) {
            window.location.href = "teacher.html";
        } else {
            window.location.href = "dashboard.html";
        }
    });
}

function initRegisterForm() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const passwordInput = form.querySelector('[name="password"]');
    const roleInput = form.querySelector('[name="role"]');
    const errorBox = form.querySelector("#formError");
    const successBox = form.querySelector("#formSuccess");

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const role = roleInput.value || "student";

        clearError(errorBox);
        clearSuccess(successBox);

        if (!name || !email || !password) {
            showError(errorBox, "Заполните все обязательные поля");
            return;
        }

        showSuccess(successBox, "Форма заполнена успешно");

        setTimeout(() => {
            if (role === "teacher") {
                window.location.href = "teacher.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 300);
    });
}

function showError(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function clearError(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}

function showSuccess(container, message) {
    if (!container) return;
    container.textContent = message;
    container.style.display = "block";
}

function clearSuccess(container) {
    if (!container) return;
    container.textContent = "";
    container.style.display = "none";
}