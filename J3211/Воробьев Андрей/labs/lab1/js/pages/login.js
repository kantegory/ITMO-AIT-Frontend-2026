import {showModal} from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("InputEmail").value.trim();

        const password = document.getElementById("InputPassword").value;

        const ADMIN_EMAIL = "admin@admin.com";
        const ADMIN_PASSWORD = "admin";

        if (email !== ADMIN_EMAIL) {
            showModal("Ошибка входа", "Аккаунт с таким email не найден.");
            return;
        }

        if (password !== ADMIN_PASSWORD) {
            showModal("Ошибка входа", "Неверный пароль.");
            return;
        }

        showModal("Добро пожаловать", "Вы успешно вошли в систему.");

        setTimeout(() => {
            window.location.href = "account.html";
        }, 1500);
    });
});