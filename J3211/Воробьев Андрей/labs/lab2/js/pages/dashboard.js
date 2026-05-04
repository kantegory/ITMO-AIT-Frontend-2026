import { getTransactionsByUser } from "../core/api.js";
import { getCurrentUser } from "../core/auth.js";
import { showModal } from "../core/modal.js";

let userTransactions = [];

function formatMoney(value) {
    return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
}

function formatPeriodFromDate(dateISO) {
    const date = new Date(dateISO);
    const period = date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    return period.charAt(0).toUpperCase() + period.slice(1).replace(" г.", "");
}

function getTransactionPeriod(transaction) {
    if (transaction.period && typeof transaction.period === "string") {
        return transaction.period.replace(" г.", "");
    }
    return formatPeriodFromDate(transaction.date);
}

function getSortedPeriods(transactions) {
    const periodByTime = {};

    transactions.forEach((transaction) => {
        const period = getTransactionPeriod(transaction);
        const time = new Date(transaction.date).getTime();

        if (!periodByTime[period] || time > periodByTime[period]) {
            periodByTime[period] = time;
        }
    });

    return Object.keys(periodByTime).sort((a, b) => periodByTime[b] - periodByTime[a]);
}

function getStatsByPeriod(transactions, period) {
    const rows = transactions.filter((item) => getTransactionPeriod(item) === period);

    const income = rows
        .filter((item) => item.amount > 0)
        .reduce((sum, item) => sum + item.amount, 0);

    const expense = Math.abs(
        rows
            .filter((item) => item.amount < 0)
            .reduce((sum, item) => sum + item.amount, 0)
    );

    const categoryExpenses = {};

    rows.forEach((item) => {
        if (item.amount < 0) {
            categoryExpenses[item.category] = (categoryExpenses[item.category] || 0) + Math.abs(item.amount);
        }
    });

    const totalExpense = Object.values(categoryExpenses).reduce((sum, value) => sum + value, 0);

    return {
        income,
        expense,
        categoryExpenses,
        totalExpense
    };
}

function renderMainStats(stats) {
    const incomeEl = document.getElementById("dashboardIncome");
    const expenseEl = document.getElementById("dashboardExpense");
    const efficiencyEl = document.getElementById("dashboardEfficiency");

    incomeEl.textContent = formatMoney(stats.income);
    expenseEl.textContent = formatMoney(stats.expense);

    if (stats.income === 0 && stats.expense === 0) {
        efficiencyEl.textContent = "Нет данных";
        return;
    }

    if (stats.income === 0) {
        efficiencyEl.textContent = "Только расходы";
        return;
    }

    const efficiency = Math.round(((stats.income - stats.expense) / stats.income) * 100);
    efficiencyEl.textContent = `${efficiency}%`;
}

function renderCategoryBreakdown(stats) {
    const container = document.getElementById("categoriesBreakdown");
    const colors = ["bg-success", "bg-info", "bg-warning", "bg-danger", "bg-primary", "bg-secondary"];

    const entries = Object.entries(stats.categoryExpenses)
        .sort((a, b) => b[1] - a[1]);

    if (!entries.length) {
        container.innerHTML = '<p class="text-muted mb-0">За выбранный период расходов нет.</p>';
        return;
    }

    container.innerHTML = entries.map(([name, amount], index) => {
        const percent = stats.totalExpense ? Math.round((amount / stats.totalExpense) * 100) : 0;
        const color = colors[index % colors.length];

        return `
            <div class="mb-4">
                <div class="d-flex justify-content-between mb-1">
                    <span>${name}</span>
                    <span class="fw-bold">${formatMoney(amount)}</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${color}" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

function renderInsight(currentStats, periods) {
    const insightEl = document.getElementById("dashboardInsight");
    const periodSelect = document.getElementById("dashboardPeriod");
    const selectedPeriod = periodSelect.value;
    const selectedIndex = periods.indexOf(selectedPeriod);

    if (selectedIndex < 0 || selectedIndex === periods.length - 1) {
        insightEl.textContent = "Недостаточно данных для сравнения с предыдущим месяцем.";
        return;
    }

    const previousPeriod = periods[selectedIndex + 1];
    const prevStats = getStatsByPeriod(userTransactions, previousPeriod);

    if (prevStats.expense === 0 && currentStats.expense === 0) {
        insightEl.textContent = "В обоих периодах расходов нет.";
        return;
    }

    if (prevStats.expense === 0) {
        insightEl.textContent = "В предыдущем месяце расходов не было. Вы отлично контролировали бюджет.";
        return;
    }

    const delta = currentStats.expense - prevStats.expense;
    const deltaPercent = Math.round((Math.abs(delta) / prevStats.expense) * 100);

    if (delta === 0) {
        insightEl.textContent = "Ваши расходы не изменились относительно прошлого месяца.";
    } else if (delta > 0) {
        insightEl.textContent = `Расходы выросли на ${deltaPercent}% относительно ${previousPeriod}.`;
    } else {
        insightEl.textContent = `Расходы снизились на ${deltaPercent}% относительно ${previousPeriod}.`;
    }
}

function renderMonthlyChart(periods) {
    const chartEl = document.getElementById("monthlyChart");

    const chartData = periods
        .slice()
        .reverse()
        .map((period) => ({
            period,
            expense: getStatsByPeriod(userTransactions, period).expense
        }));

    const maxExpense = Math.max(...chartData.map((item) => item.expense), 0);

    if (!maxExpense) {
        chartEl.innerHTML = '<p class="text-muted mb-0">Недостаточно данных для графика.</p>';
        return;
    }

    chartEl.innerHTML = `
        <div class="d-flex align-items-end gap-2" style="height: 180px;">
            ${chartData.map((item) => {
                const height = Math.max(10, Math.round((item.expense / maxExpense) * 160));
                return `
                    <div class="d-flex flex-column align-items-center flex-fill">
                        <div class="w-100 bg-primary rounded" style="height: ${height}px;"></div>
                        <small class="text-muted mt-2 text-center">${item.period.split(" ")[0]}</small>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function renderDashboard(periods) {
    const periodSelect = document.getElementById("dashboardPeriod");
    const selectedPeriod = periodSelect.value;

    const stats = getStatsByPeriod(userTransactions, selectedPeriod);

    renderMainStats(stats);
    renderCategoryBreakdown(stats);
    renderInsight(stats, periods);
    renderMonthlyChart(periods);
}

function fillPeriodSelect(periods) {
    const periodSelect = document.getElementById("dashboardPeriod");

    periodSelect.innerHTML = periods.map((period) => `<option value="${period}">${period}</option>`).join("");

    periodSelect.addEventListener("change", () => {
        renderDashboard(periods);
    });
}

async function initDashboardPage() {
    const user = getCurrentUser();

    try {
        userTransactions = await getTransactionsByUser(user.id);

        if (!userTransactions.length) {
            document.getElementById("dashboardPeriod").innerHTML = "<option>Нет данных</option>";
            document.getElementById("categoriesBreakdown").innerHTML = '<p class="text-muted mb-0">Транзакции отсутствуют.</p>';
            document.getElementById("dashboardInsight").textContent = "Добавьте транзакции, чтобы увидеть аналитику.";
            return;
        }

        const periods = getSortedPeriods(userTransactions);

        fillPeriodSelect(periods);
        renderDashboard(periods);
    } catch (error) {
        showModal("Ошибка", error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initDashboardPage();
});

