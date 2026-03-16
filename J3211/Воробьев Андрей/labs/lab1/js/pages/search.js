import { showModal } from "../core/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("addTransactionBtn");
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            showModal("Уведомление", "Форма добавления транзакции в разработке.");
        });
    }

    const addRule = document.getElementById("addAccountRule");
    if (addRule) {
        addRule.addEventListener("click", () => {
            showModal("Уведомление", "Форма добавления правила в разработке.");
        });
    }

    const filterForm = document.getElementById("filterForm");
    if (filterForm) {
        filterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showModal("Поиск", "Функционал фильтрации в разработке.");
        });
    }
});