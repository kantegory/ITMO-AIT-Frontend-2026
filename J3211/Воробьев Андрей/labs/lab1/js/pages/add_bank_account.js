import { showModal } from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            showModal("Уведомление", "Функционал ещё не доступен.");
        });
    });
});