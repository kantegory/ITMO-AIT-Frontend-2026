import {showModal, showTransactionForm, showRuleForm} from "../core/modal.js";
import {
    getAccountsByUser,
    getTransactionsByUser,
    getTransactionsByFilter,
    createTransaction,
    getCategories,
    getUserNotificationSettings,
    updateUserNotificationSettings
} from "../core/api.js";
import {getCurrentUser} from "../core/auth.js";

let allTransactions = [];
let accountsById = {};

function formatDate(dateISO) {
    const date = new Date(dateISO);
    return date.toLocaleDateString("ru-RU");
}

function formatAmount(value) {
    return `${value > 0 ? "+" : "-"} ${Math.abs(value).toLocaleString("ru-RU")} ₽`;
}

function renderTransactions(rows) {
    const tableBody = document.querySelector("#transactionsTableBody");

    if (!rows.length) {
        tableBody.innerHTML = '';
        return;
    }

    tableBody.innerHTML = rows.map((transaction) => {
        const accountName = accountsById[transaction.accountId];
        const amountClass = transaction.amount >= 0 ? "text-success" : "text-danger";

        return `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.category}</td>
                <td><span class="badge bg-light text-dark border">${accountName}</span></td>
                <td class="text-muted">${transaction.comment}</td>
                <td class="text-end ${amountClass} fw-bold">${formatAmount(transaction.amount)}</td>
            </tr>
        `;
    }).join("");
}


async function initSearchPage() {
    const user = getCurrentUser();

    try {
        const [accounts, transactions, categoriesData] = await Promise.all([getAccountsByUser(user.id), getTransactionsByUser(user.id), getCategories()]);

        accountsById = accounts.reduce((acc, account) => {
            acc[account.id] = account.name;
            return acc;
        }, {});

        allTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        const accountSelect = document.querySelector('select[name="account"]');
        const options = ["Все счета", ...accounts.map((account) => account.name)];
        accountSelect.innerHTML = options.map((name) => `<option>${name}</option>`).join("");

        const categories = [...new Set(categoriesData.map((cat) => cat.name))]
            .sort((a, b) => a.localeCompare(b, "ru"));

        const categorySelect = document.querySelector('select[name="category"]');
        const categoryOptions = ["Все категории", ...categories];
        categorySelect.innerHTML = categoryOptions.map((name) => `<option>${name}</option>`).join("");

        const addTransactionBtn = document.getElementById("addTransactionBtn");
        addTransactionBtn.addEventListener("click", () => {
            showTransactionForm(accounts, categories, (data) => {
                createTransaction({
                    userId: user.id,
                    accountId: data.accountId,
                    date: data.date,
                    category: data.category,
                    comment: data.comment,
                    amount: data.amount
                }).then(() => {
                    showModal("Успех", "Транзакция добавлена");
                    setTimeout(() => location.reload(), 500);
                }).catch(err => {
                    showModal("Ошибка", err.message);
                });
            });
        });

        const addRuleBtn = document.getElementById("addAccountRule");
        addRuleBtn.addEventListener("click", () => {
            getUserNotificationSettings(user.id).then((settings) => {
                showRuleForm(settings, (notificationSettings) => {
                    updateUserNotificationSettings(user.id, notificationSettings).then(() => {
                        showModal("Успех", "Настройки уведомлений сохранены");
                    }).catch((err) => {
                        showModal("Ошибка", err.message);
                    });
                });
            }).catch((err) => {
                showModal("Ошибка", err.message);
            });
        });

        renderTransactions(allTransactions);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

function filterTransactions(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const filterData = {};

    formData.forEach((value, label) => {
        filterData[label] = value;
    });

    const user = getCurrentUser();
    getTransactionsByFilter(user.id, filterData).then((transactions) => {
        allTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderTransactions(allTransactions);
    }).catch(err => {
        showModal("Ошибка", err.message);
    });
}

window.filterTransactions = filterTransactions;

document.addEventListener("DOMContentLoaded", () => {
    initSearchPage().catch(() => {
        showModal("Ошибка", "Не удалось загрузить транзакции.");
    });


});