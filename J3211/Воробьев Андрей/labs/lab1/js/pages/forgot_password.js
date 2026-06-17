import {showModal} from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("ForgotPasswordEmail").value.trim();

        const ADMIN_EMAIL = "admin@admin.com";

        if (email !== ADMIN_EMAIL) {
            showModal("Ошибка", "Аккаунт с таким email не найден.");
            return;
        }

        showModal("Письмо отправлено", "Инструкции по восстановлению пароля отправлены на email.");

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});