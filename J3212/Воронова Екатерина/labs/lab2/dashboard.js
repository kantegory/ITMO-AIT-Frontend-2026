document.addEventListener("DOMContentLoaded", async () => {
  const user = requireAuth();

  const userName = document.querySelector(".user-chip span");
  if (userName) {
    userName.textContent = user.name;
  }

  const accounts = await apiGet(`/accounts?userId=${user.id}`);
  const transactions = await apiGet(`/transactions?userId=${user.id}`);
  const budgets = await apiGet(`/budgets?userId=${user.id}`);

  renderStats(accounts, transactions);
  renderAccounts(accounts);
  renderTransactions(transactions);
  renderBudgets(budgets);
});

function renderStats(accounts, transactions) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const income = transactions
    .filter(item => item.type === "Доход")
    .reduce((sum, item) => sum + item.amount, 0);
  const expense = transactions
    .filter(item => item.type === "Расход")
    .reduce((sum, item) => sum + item.amount, 0);
  const savings = accounts
    .filter(item => item.title.toLowerCase().includes("накоп"))
    .reduce((sum, item) => sum + item.balance, 0);

  const totalBalanceEl = document.getElementById("totalBalance");
  const monthIncomeEl = document.getElementById("monthIncome");
  const monthExpenseEl = document.getElementById("monthExpense");
  const savingsEl = document.getElementById("savingsValue");

  if (totalBalanceEl) totalBalanceEl.textContent = `${totalBalance.toLocaleString("ru-RU")} ₽`;
  if (monthIncomeEl) monthIncomeEl.textContent = `${income.toLocaleString("ru-RU")} ₽`;
  if (monthExpenseEl) monthExpenseEl.textContent = `${expense.toLocaleString("ru-RU")} ₽`;
  if (savingsEl) savingsEl.textContent = `${savings.toLocaleString("ru-RU")} ₽`;
}

function renderAccounts(accounts) {
  const container = document.getElementById("accountsContainer");
  if (!container) return;

  container.innerHTML = accounts.map(account => `
    <div class="account-box">
      <div>
        <strong>${account.title}</strong>
        <p>${account.type}</p>
      </div>
      <span>${account.balance.toLocaleString("ru-RU")} ₽</span>
    </div>
  `).join("");
}

function renderTransactions(transactions) {
  const tbody = document.getElementById("dashboardTransactions");
  if (!tbody) return;

  const latest = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  tbody.innerHTML = latest.map(item => `
    <tr>
      <td>${formatDate(item.date)}</td>
      <td>${item.description}</td>
      <td><span class="status-badge light">${item.category}</span></td>
      <td class="${item.type === "Доход" ? "text-success" : "text-danger"}">
        ${item.type === "Доход" ? "+" : "-"}${item.amount.toLocaleString("ru-RU")} ₽
      </td>
    </tr>
  `).join("");
}

function renderBudgets(budgets) {
  const container = document.getElementById("budgetsContainer");
  if (!container) return;

  container.innerHTML = budgets.map(item => {
    const percent = Math.min(Math.round((item.spent / item.limit) * 100), 100);

    return `
      <div class="budget-item">
        <div class="d-flex justify-content-between">
          <span>${item.category}</span>
          <span>${item.spent.toLocaleString("ru-RU")} / ${item.limit.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div class="progress custom-progress">
          <div class="progress-bar" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  }).join("");
}