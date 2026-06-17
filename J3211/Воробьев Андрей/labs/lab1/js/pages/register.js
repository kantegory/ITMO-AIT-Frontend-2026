import {showModal} from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("RegisterEmail").value.trim();

        const password = document.getElementById("RegisterPassword").value;

        const confirm = document.getElementById("RegisterConfirmPassword").value;

        if (password.length < 6) {
            showModal("Ошибка", "Пароль должен содержать минимум 6 символов.");
            return;
        }

        if (password !== confirm) {
            showModal("Ошибка", "Пароли не совпадают.");
            return;
        }

        showModal("Регистрация успешна", `Аккаунт ${email} был бы создан.`);

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
});