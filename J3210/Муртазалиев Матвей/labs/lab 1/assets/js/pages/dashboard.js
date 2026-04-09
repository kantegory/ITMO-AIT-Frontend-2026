import { ensureSession, getCollection } from "../auth.js";
import {
  $,
  escapeAttribute,
  escapeHtml,
  filterByCurrentMonth,
  formatCurrency,
  formatLongDate,
  getAccountIcon,
  getBudgetUsagePercent,
  getCategoryMeta,
  getSpentByCategory,
  getTopExpenseCategory,
  setText,
  sortTransactions,
} from "../utils.js";

export async function initDashboardPage() {
  const session = await ensureSession();
  const [accounts, budgets, transactions] = await Promise.all([
    getCollection("accounts", session.user.id),
    getCollection("budgets", session.user.id),
    getCollection("transactions", session.user.id),
  ]);

  const state = {
    user: session.user,
    accounts,
    budgets,
    transactions: sortTransactions(transactions),
    filters: {
      search: "",
      category: "all",
      amount: 0,
      from: "",
      to: "",
    },
  };

  renderDashboardSummary(state);
  renderAccounts(accounts);
  renderBudgets(budgets, state.transactions);
  fillCategoryFilter(state.transactions);
  initDashboardFilters(state);
  renderTransactions(state);
}

function initDashboardFilters(state) {
  const fields = {
    search: $("[data-filter-search]"),
    category: $("[data-filter-category]"),
    amount: $("[data-filter-amount]"),
    from: $("[data-filter-date-from]"),
    to: $("[data-filter-date-to]"),
  };

  const applyFilters = () => {
    state.filters = {
      search: fields.search?.value.trim().toLowerCase() || "",
      category: fields.category?.value || "all",
      amount: Number(fields.amount?.value || 0),
      from: fields.from?.value || "",
      to: fields.to?.value || "",
    };
    renderTransactions(state);
  };

  Object.values(fields).forEach((field) => {
    field?.addEventListener("input", applyFilters);
    field?.addEventListener("change", applyFilters);
  });

  $("[data-filter-reset]")?.addEventListener("click", () => {
    if (fields.search) fields.search.value = "";
    if (fields.category) fields.category.value = "all";
    if (fields.amount) fields.amount.value = "";
    if (fields.from) fields.from.value = "";
    if (fields.to) fields.to.value = "";
    applyFilters();
  });
}

function renderDashboardSummary(state) {
  const balance = state.accounts.reduce((total, item) => total + Number(item.balance), 0);
  const currentMonthTransactions = filterByCurrentMonth(state.transactions);
  const spend = currentMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);
  const income = currentMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);
  const savingsAccount = state.accounts.find((item) => item.type === "savings");
  const savingsTarget = Number(savingsAccount?.target || 150000);
  const riskCategories = state.budgets.filter((item) => getSpentByCategory(item.category, state.transactions) >= Number(item.limit) * 0.9);
  const topCategory = getTopExpenseCategory(state.transactions);

  setText("[data-dashboard-greeting]", `Добрый вечер, ${state.user.firstName}`);
  setText(
    "[data-dashboard-summary]",
    topCategory
      ? `Сейчас больше всего денег уходит на категорию «${topCategory.name}». За месяц расходы составили ${formatCurrency(spend)}.`
      : "После подключения API здесь отображается сводка по данным пользователя.",
  );
  setText("[data-metric-balance]", formatCurrency(balance));
  setText("[data-metric-balance-status]", `${income >= spend ? "+" : "−"}${formatCurrency(Math.abs(income - spend))} за месяц`);
  setText("[data-metric-spend]", formatCurrency(spend));
  setText("[data-metric-spend-status]", `${Math.min(100, getBudgetUsagePercent(state.budgets, state.transactions))}% лимита`);
  setText("[data-metric-savings]", formatCurrency(savingsAccount?.balance || 0));
  setText(
    "[data-metric-savings-status]",
    `Цель ${Math.min(100, Math.round(((savingsAccount?.balance || 0) / savingsTarget) * 100))}%`,
  );
  setText("[data-metric-risk]", `${riskCategories.length} категории`);
  setText("[data-metric-risk-status]", riskCategories.length ? "Требуют внимания" : "Все под контролем");
}

function renderAccounts(accounts) {
  const container = $("[data-accounts-list]");
  if (!container) return;

  container.setAttribute("role", "list");
  container.setAttribute("aria-label", "Список счетов");
  container.innerHTML = accounts
    .map((account) => `
      <div class="col-md-4">
        <div class="account-card" role="listitem" aria-label="${escapeAttribute(`${account.name}, баланс ${formatCurrency(account.balance)}`)}">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <small>${escapeHtml(account.name)}</small>
              <h3>${formatCurrency(account.balance)}</h3>
            </div>
            <i class="bi ${getAccountIcon(account.type)}" aria-hidden="true"></i>
          </div>
          <p class="mb-0 text-secondary small">${escapeHtml(account.description || account.provider || "Подключено через API")}</p>
        </div>
      </div>
    `)
    .join("");
}

function renderBudgets(budgets, transactions) {
  const container = $("[data-budgets-list]");
  if (!container) return;

  container.setAttribute("role", "list");
  container.setAttribute("aria-label", "Список бюджетов");
  container.innerHTML = budgets
    .map((budget, index) => {
      const spent = getSpentByCategory(budget.category, transactions);
      const percent = Math.min(100, Math.round((spent / Number(budget.limit || 1)) * 100));
      const progressClass = percent >= 90 ? "progress-bar warning-bar" : "progress-bar";
      const extraClass = index === budgets.length - 1 ? " mb-0" : "";

      return `
        <div class="budget-item${extraClass}" role="listitem">
          <div class="d-flex justify-content-between">
            <strong>${escapeHtml(budget.category)}</strong>
            <span>${formatCurrency(spent)} / ${formatCurrency(budget.limit)}</span>
          </div>
          <div class="progress soft-progress mt-2">
            <div
              class="${progressClass}"
              style="width: ${percent}%"
              role="progressbar"
              aria-label="${escapeAttribute(`Использование бюджета ${budget.category}`)}"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow="${percent}"
            ></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function fillCategoryFilter(transactions) {
  const select = $("[data-filter-category]");
  if (!select) return;

  const categories = [...new Set(transactions.map((item) => item.category).filter(Boolean))];
  select.innerHTML = [
    '<option value="all">Все</option>',
    ...categories.map((category) => `<option value="${escapeAttribute(category.toLowerCase())}">${escapeHtml(category)}</option>`),
  ].join("");
}

function renderTransactions(state) {
  const list = $("[data-transaction-list]");
  const emptyState = $("[data-empty-state]");
  if (!list) return;

  list.setAttribute("role", "list");
  list.setAttribute("aria-label", "Список транзакций");
  const filtered = state.transactions.filter((item) => {
    const title = `${item.title} ${item.category} ${item.accountName || ""}`.toLowerCase();
    const normalizedCategory = item.category.toLowerCase();

    return (
      (!state.filters.search || title.includes(state.filters.search)) &&
      (state.filters.category === "all" || normalizedCategory === state.filters.category) &&
      (!state.filters.amount || Number(item.amount) <= state.filters.amount) &&
      (!state.filters.from || item.date >= state.filters.from) &&
      (!state.filters.to || item.date <= state.filters.to)
    );
  });

  list.innerHTML = filtered
    .map((transaction) => {
      const categoryMeta = getCategoryMeta(transaction.category, transaction.type);
      return `
        <article class="transaction-item" role="listitem" aria-label="${escapeAttribute(`${transaction.title}, ${transaction.category}, ${formatLongDate(transaction.date)}, ${transaction.type === "income" ? "доход" : "расход"} ${formatCurrency(transaction.amount)}`)}">
          <div class="transaction-item__icon ${categoryMeta.backgroundClass}">
            <i class="bi ${categoryMeta.icon}" aria-hidden="true"></i>
          </div>
          <div class="transaction-item__body">
            <div class="d-flex justify-content-between gap-3 flex-wrap">
              <div>
                <h3>${escapeHtml(transaction.title)}</h3>
                <p class="mb-0 text-secondary">${escapeHtml(transaction.category)} • ${formatLongDate(transaction.date)}</p>
              </div>
              <strong class="${transaction.type === "income" ? "text-success" : "text-danger"}">
                ${transaction.type === "income" ? "+" : "−"} ${formatCurrency(transaction.amount)}
              </strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  setText("[data-transaction-count]", String(filtered.length));
  emptyState?.classList.toggle("d-none", filtered.length !== 0);
}
