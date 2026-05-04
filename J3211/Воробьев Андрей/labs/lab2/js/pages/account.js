import {getAccountsByUser, getTransactionsByUser} from "../core/api.js";
import {getCurrentUser} from "../core/auth.js";
import {showModal} from "../core/modal.js";

function formatMoney(value) {
    return `${value.toLocaleString("ru-RU")} ₽`;
}

function formatDate(dateISO) {
    return new Date(dateISO).toLocaleDateString("ru-RU");
}

function renderAccounts(accounts) {
    const list = document.querySelector("#accountsList");

    if (!accounts.length) {
        list.innerHTML = '';
        return;
    }

    list.innerHTML = accounts.map((account) => {
        const positive = account.balance >= 0;
        const amountClass = positive ? "income-text" : "expense-text";
        const amountText = `${positive ? "+" : "-"} ${Math.abs(account.balance).toLocaleString("ru-RU")} ₽`;

        return `
            <div class="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                <div><span class="fw-bold">${account.name}</span></div>
                <div class="text-end"><div class="fw-bold ${amountClass}">${amountText}</div></div>
            </div>
        `;
    }).join("");
}

function renderRecentTransactions(transactions, accountsById) {
    const tableBody = document.querySelector("#recentTransactionsBody");

    if (!transactions.length) {
        tableBody.innerHTML = '';
        return;
    }

    tableBody.innerHTML = transactions.slice(0, 5).map((transaction) => {
        const amountClass = transaction.amount >= 0 ? "text-success" : "text-danger";
        const amountText = `${transaction.amount >= 0 ? "+" : "-"} ${Math.abs(transaction.amount).toLocaleString("ru-RU")} ₽`;

        return `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.category}</td>
                <td><span class="badge bg-light text-dark border">${accountsById[transaction.accountId]}</span></td>
                <td class="text-end ${amountClass} fw-bold">${amountText}</td>
            </tr>
        `;
    }).join("");
}

function renderStats(transactions) {
    const income = transactions.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
    const expense = Math.abs(transactions.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0));
    const balance = income - expense;

    const incomeNode = document.querySelector("#incomeValue");
    const expenseNode = document.querySelector("#expenseValue");
    const balanceNode = document.querySelector("#balanceValue");

    incomeNode.textContent = formatMoney(income);
    expenseNode.textContent = formatMoney(expense);
    balanceNode.textContent = formatMoney(balance);
}

async function initAccountPage() {
    const user = getCurrentUser();

    try {
        const [accounts, transactions] = await Promise.all([getAccountsByUser(user.id), getTransactionsByUser(user.id)]);

        const accountsById = accounts.reduce((acc, account) => {
            acc[account.id] = account.name;
            return acc;
        }, {});

        const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderAccounts(accounts);
        renderRecentTransactions(sortedTransactions, accountsById);
        renderStats(sortedTransactions);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initAccountPage();
});



