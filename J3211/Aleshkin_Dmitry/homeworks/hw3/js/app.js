let expenseChart;
let flowChart;

const sameId = (a, b) => String(a) === String(b);
const toNumber = (value) => Number(value || 0);

function formatMoney(value, currency = 'RUB') {
  const symbols = {
    RUB: '₽',
    USD: '$',
    EUR: '€'
  };

  return `${Number(value || 0).toLocaleString('ru-RU')} ${symbols[currency] || currency}`;
}

function getSortedCategories(includeIncome = true) {
  const categories = Api.CATEGORIES.filter((item) => includeIncome || item.value !== 'income');
  return [...categories].sort((a, b) => a.label.localeCompare(b.label, 'ru'));
}


function readCssVar(name, fallback = '') {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

function getChartPalette() {
  return {
    text: readCssVar('--chart-text', '#334155'),
    grid: readCssVar('--chart-grid', 'rgba(148, 163, 184, 0.22)'),
  };
}

function updateChartTheme(chart) {
  if (!chart) return;
  const palette = getChartPalette();
  if (chart.options?.plugins?.legend?.labels) {
    chart.options.plugins.legend.labels.color = palette.text;
  }
  if (chart.options?.scales) {
    Object.values(chart.options.scales).forEach((scale) => {
      if (scale.ticks) scale.ticks.color = palette.text;
      if (scale.grid) scale.grid.color = palette.grid;
      if (scale.border) scale.border.color = palette.grid;
    });
  }
  chart.update();
}

function refreshChartsTheme() {
  updateChartTheme(expenseChart);
  updateChartTheme(flowChart);
}

function scrollToBlock(elementOrId) {
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 110;
  window.scrollTo({ top, behavior: 'smooth' });
}

function showPageNotice(targetId, message, type = 'success') {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = message;
  el.classList.remove('d-none');
}

function hidePageNotice(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.classList.add('d-none');
}

function renderDemoBanner(context) {
  const container = document.getElementById('demoModeBanner');
  if (!container || !context.isDemo) return;
  container.innerHTML = `
    <div class="demo-banner">
      <div>
        <div class="demo-banner-title">Демо-режим</div>
        <div class="demo-banner-text">Открыты обычные страницы сайта. Пока вы не вошли в систему, на них показываются демонстрационные данные.</div>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <a class="btn btn-primary" href="login.html">Войти</a>
        <a class="btn btn-outline-primary" href="register.html">Регистрация</a>
      </div>
    </div>
  `;
}

async function bindCommonUi(context) {
  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = context.user.name; });
  document.querySelectorAll('[data-user-email]').forEach((el) => { el.textContent = context.user.email; });
  document.querySelectorAll('.brand-demo-link').forEach((link) => { link.href = 'index.html'; });

  try {
    const rates = await Api.fetchExchangeRates();
    document.querySelectorAll('.logout-btn').forEach((btn) => {
      const parent = btn.parentElement;
      if (!parent) return;
      let ratesNode = parent.querySelector('.navbar-rates');
      if (!ratesNode) {
        ratesNode = document.createElement('div');
        ratesNode.className = 'navbar-rates';
        btn.insertAdjacentElement('beforebegin', ratesNode);
      }
      ratesNode.innerHTML = `
        <span class="navbar-rate-pill">USD: ${Number(rates.USD || 0).toFixed(2)} ₽</span>
        <span class="navbar-rate-pill">EUR: ${Number(rates.EUR || 0).toFixed(2)} ₽</span>
      `;
    });
  } catch (error) {}

  document.querySelectorAll('.logout-btn').forEach((btn) => {
    if (context.isDemo) {
      btn.textContent = 'Войти';
      btn.classList.remove('btn-outline-light');
      btn.classList.add('btn-light');
      btn.href = 'login.html';
      return;
    }

    btn.addEventListener('click', (event) => {
      event.preventDefault();
      Api.clearAuth();
      window.location.href = 'dashboard.html';
    });
  });
}

function fillCategorySelect(select, includeIncome = true) {
  if (!select) return;
  const options = getSortedCategories(includeIncome);
  select.innerHTML = options.map((item) => `<option value="${item.value}">${item.label}</option>`).join('');
}

async function loadState(context) {
  const data = await Api.getUserData(context.user.id, { isDemo: context.isDemo });
  return { ...context, ...data };
}

window.addEventListener('themechange', refreshChartsTheme);

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;
  const context = await Api.getPageContext();
  await bindCommonUi(context);
  renderDemoBanner(context);

  if (page === 'dashboard') await renderDashboardPage(context);
  if (page === 'transactions') await renderTransactionsPage(context);
  if (page === 'reports') await renderReportsPage(context);
  if (page === 'integrations') await renderIntegrationsPage(context);
});

async function renderDashboardPage(context) {
  const state = await loadState(context);
  const { user, accounts, transactions, budgets } = state;
  const summary = await Api.computeSummary(transactions, accounts);
  const expensesByCategory = Api.groupExpensesByCategory(transactions);

  document.getElementById('joinedDate').textContent = Api.formatDate(user.joinedDate);
  document.getElementById('totalBalance').textContent = Api.formatCurrency(summary.totalBalance);
  document.getElementById('monthIncome').textContent = Api.formatCurrency(summary.income);
  document.getElementById('monthExpense').textContent = Api.formatCurrency(summary.expenses);

  document.getElementById('accountsList').innerHTML = accounts.length
    ? accounts.map((account) => `
        <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
          <div>
            <div class="fw-semibold">${account.name}</div>
            <small class="text-muted">${account.bank}</small>
          </div>
          <span>${Api.formatCurrency(account.balance, account.currency)}</span>
        </li>
      `).join('')
    : '<li class="list-group-item text-muted">Счетов пока нет</li>';

  document.getElementById('budgetTable').innerHTML = budgets.length
    ? budgets.map((budget) => {
        const spent = expensesByCategory.find((item) => item.key === budget.category)?.amount || 0;
        const percent = budget.limit > 0 ? Math.min(999, Math.round((spent / budget.limit) * 100)) : 0;

        return `
          <tr>
            <td>${budget.categoryName}</td>
            <td>${Api.formatCurrency(budget.limit)}</td>
            <td>${Api.formatCurrency(spent)}</td>
            <td>${percent}%</td>
            <td class="text-end">
              ${state.isDemo ? '<span class="text-muted">Только просмотр</span>' : `
                <button class="btn btn-sm btn-outline-primary me-1" data-edit-budget="${budget.id}">Изменить</button>
                <button class="btn btn-sm btn-outline-danger" data-delete-budget="${budget.id}">Удалить</button>
              `}
            </td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="5" class="text-center text-muted">Расходы пока не заданы</td></tr>';

  renderExpenseChart(transactions);
  bindBudgetControls(state);
}

function bindBudgetControls(state) {
  const form = document.getElementById('budgetForm');
  if (!form) return;
  const categorySelect = document.getElementById('budgetCategory');
  fillCategorySelect(categorySelect, false);

  if (state.isDemo) {
    form.querySelectorAll('input, select, button').forEach((el) => { el.disabled = true; });
    showPageNotice('budgetNotice', 'В демо-режиме запланированные расходы доступны только для просмотра.', 'info');
    return;
  }

  form.onsubmit = async (event) => {
    event.preventDefault();
    hidePageNotice('budgetNotice');

    const budgetId = document.getElementById('budgetId').value;
    const category = categorySelect.value;
    const categoryName = categorySelect.selectedOptions[0]?.text || '';
    const limit = toNumber(document.getElementById('budgetLimit').value);

    if (!category || limit <= 0) {
      showPageNotice('budgetNotice', 'Укажите категорию и положительный лимит.', 'warning');
      return;
    }

    const duplicate = state.budgets.find((item) => item.category === category && !sameId(item.id, budgetId));
    if (duplicate) {
      showPageNotice('budgetNotice', 'Бюджет для этой категории уже существует. Нажмите «Изменить» у нужной строки.', 'warning');
      return;
    }

    try {
      if (budgetId) {
        await Api.updateBudget(budgetId, { category, categoryName, limit });
        showPageNotice('budgetNotice', 'Бюджет обновлён.', 'success');
      } else {
        await Api.addBudget({ userId: state.user.id, category, categoryName, limit });
        showPageNotice('budgetNotice', 'Бюджет добавлен.', 'success');
      }
      form.reset();
      document.getElementById('budgetId').value = '';
      await renderDashboardPage(state);
    } catch (error) {
      showPageNotice('budgetNotice', error.message, 'danger');
    }
  };

  document.querySelectorAll('[data-edit-budget]').forEach((button) => {
    button.onclick = () => {
      const budget = state.budgets.find((item) => sameId(item.id, button.dataset.editBudget));
      if (!budget) return;
      document.getElementById('budgetId').value = budget.id;
      categorySelect.value = budget.category;
      document.getElementById('budgetLimit').value = budget.limit;
      showPageNotice('budgetNotice', `Редактирование бюджета: ${budget.categoryName}. Измените лимит и нажмите «Сохранить бюджет».`, 'info');
      scrollToBlock('budgetForm');
    };
  });

  document.querySelectorAll('[data-delete-budget]').forEach((button) => {
    button.onclick = async () => {
      try {
        await Api.deleteBudget(button.dataset.deleteBudget);
        showPageNotice('budgetNotice', 'Бюджет удалён.', 'success');
        await renderDashboardPage(state);
      } catch (error) {
        showPageNotice('budgetNotice', error.message, 'danger');
      }
    };
  });
}

function renderExpenseChart(transactions) {
  const canvas = document.getElementById('expensesChart');
  if (!canvas) return;
  const grouped = Api.groupExpensesByCategory(transactions);
  const empty = document.getElementById('expensesEmpty');
  if (expenseChart) expenseChart.destroy();

  if (!grouped.length) {
    canvas.classList.add('d-none');
    if (empty) {
      empty.classList.remove('d-none');
      empty.textContent = 'Пока нет расходов для построения диаграммы. Добавьте транзакции, и график обновится автоматически.';
    }
    return;
  }

  canvas.classList.remove('d-none');
  if (empty) empty.classList.add('d-none');

  const palette = getChartPalette();

  expenseChart = new Chart(canvas, {
  type: 'doughnut',
  data: {
    labels: grouped.map(item => item.name),
    datasets: [{
      data: grouped.map(item => item.amount),
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: getChartPalette().text
        }
      },
      tooltip: {
        titleMarginBottom: 12,
        bodySpacing: 6,
        callbacks: {
          label(context) {
            const value = context.parsed;
            return `${value.toLocaleString('ru-RU')} ₽`;
          }
        }
      }
    }
  }
});
}

async function renderTransactionsPage(context) {
  const state = await loadState(context);
  const filterForm = document.getElementById('filterForm');
  const addForm = document.getElementById('addTransactionForm');
  const typeSelect = document.getElementById('transactionType');
  const categorySelect = document.getElementById('transactionCategory');
  const accountSelect = document.getElementById('transactionAccount');

  document.getElementById('transactionDate').value = new Date().toISOString().slice(0, 10);

  const filterCategorySelect = document.getElementById('category');
  if (filterCategorySelect) {
    const filterOptions = getSortedCategories(true).filter((item) => item.value !== 'income');
    filterCategorySelect.innerHTML = ['<option value="all">Все</option>']
      .concat(filterOptions.map((item) => `<option value="${item.value}">${item.label}</option>`))
      .concat('<option value="income">Доход</option>')
      .join('');
  }

  const syncCategories = () => {
    const type = typeSelect.value;
    const options = type === 'income'
      ? Api.CATEGORIES.filter((item) => item.value === 'income')
      : getSortedCategories(false);
    categorySelect.innerHTML = options.map((item) => `<option value="${item.value}">${item.label}</option>`).join('');
  };

  syncCategories();
  typeSelect.onchange = syncCategories;

  filterForm.onsubmit = async (event) => {
    event.preventDefault();
    await refreshTransactions(state);
  };

  filterForm.onreset = async () => {
    setTimeout(() => refreshTransactions(state), 0);
  };

  if (state.isDemo) {
    addForm.querySelectorAll('input, select, button').forEach((el) => { el.disabled = true; });
    showPageNotice('transactionNotice', 'В демо-режиме транзакции доступны только для просмотра.', 'info');
    await refreshTransactions(state);
    return;
  }

  await refreshTransactions(state);

  addForm.onsubmit = async (event) => {
    event.preventDefault();
    hidePageNotice('transactionNotice');

    const accountId = accountSelect.value;
    const type = typeSelect.value;
    const amountValue = toNumber(document.getElementById('transactionAmount').value);
    const currency = document.getElementById('transactionCurrency').value;
    const category = categorySelect.value;
    const categoryName = categorySelect.selectedOptions[0]?.text || '';
    const description = document.getElementById('transactionDescription').value.trim();
    const date = document.getElementById('transactionDate').value;
    const amount = type === 'expense' ? -Math.abs(amountValue) : Math.abs(amountValue);

    const account = state.accounts.find((item) => sameId(item.id, accountId));
    if (!account) {
      showPageNotice('transactionNotice', 'Не найден счёт для операции. Обновите страницу или выберите доступный счёт повторно.', 'danger');
      return;
    }
    if (!description || !date || amountValue <= 0) {
      showPageNotice('transactionNotice', 'Заполните все поля транзакции корректно.', 'warning');
      return;
    }

    try {
      await Api.createTransaction({
        userId: state.user.id,
        accountId: account.id,
        date,
        description,
        category,
        categoryName,
        amount,
        currency,
        type,
        icon: type === 'income' ? 'bi-arrow-down-circle' : 'bi-arrow-up-circle',
      });
      await Api.updateAccount(account.id, { balance: toNumber(account.balance) + amount });
      addForm.reset();
      document.getElementById('transactionDate').value = new Date().toISOString().slice(0, 10);
      typeSelect.value = 'income';
      syncCategories();
      showPageNotice('transactionNotice', 'Транзакция успешно добавлена.', 'success');
      await refreshTransactions(state);
    } catch (error) {
      showPageNotice('transactionNotice', error.message, 'danger');
    }
  };
}

async function refreshTransactions(state) {
  const fresh = await loadState(state);
  state.accounts = fresh.accounts;
  state.transactions = fresh.transactions;

  const accountSelect = document.getElementById('transactionAccount');
  if (accountSelect) {
    accountSelect.innerHTML = state.accounts.length
      ? state.accounts.map((item) => `<option value="${item.id}">${item.name} — ${Api.formatCurrency(item.balance, item.currency)}</option>`).join('')
      : '<option value="">Счета отсутствуют</option>';
  }

  const filters = getFilters();
  const filtered = state.transactions.filter((item) => {
    const categoryOk = filters.category === 'all' || item.category === filters.category;
    const minOk = Math.abs(toNumber(item.amount)) >= filters.minAmount;
    const fromOk = !filters.dateFrom || item.date >= filters.dateFrom;
    const toOk = !filters.dateTo || item.date <= filters.dateTo;
    return categoryOk && minOk && fromOk && toOk;
  });

  document.getElementById('transactionTable').innerHTML = filtered.length
    ? filtered.map((item) => `
        <tr>
          <td>${Api.formatDate(item.date)}</td>
          <td>${item.description}</td>
          <td>${item.categoryName}</td>
          <td class="${toNumber(item.amount) > 0 ? 'text-success' : 'text-danger'}">${formatMoney(Math.abs(item.amount), item.currency || 'RUB')}</td>
          <td>
            ${state.isDemo ? '<span class="text-muted">Только просмотр</span>' : `<button class="btn btn-sm btn-outline-danger" data-delete-transaction="${item.id}" data-account-id="${item.accountId}" data-amount="${item.amount}">Удалить</button>`}
          </td>
        </tr>
      `).join('')
    : '<tr><td colspan="5" class="text-center text-muted">Транзакции не найдены</td></tr>';

  if (state.isDemo) return;

  document.querySelectorAll('[data-delete-transaction]').forEach((button) => {
    button.onclick = async () => {
      hidePageNotice('transactionNotice');
      try {
        const transaction = state.transactions.find((item) => sameId(item.id, button.dataset.deleteTransaction));
        const account = state.accounts.find((item) => sameId(item.id, button.dataset.accountId));
        await Api.deleteTransaction(button.dataset.deleteTransaction);
        if (account && transaction) {
          await Api.updateAccount(account.id, { balance: toNumber(account.balance) - toNumber(transaction.amount) });
        }
        showPageNotice('transactionNotice', 'Транзакция удалена.', 'success');
        await refreshTransactions(state);
      } catch (error) {
        showPageNotice('transactionNotice', error.message, 'danger');
      }
    };
  });
}

function getFilters() {
  return {
    category: document.getElementById('category').value,
    minAmount: toNumber(document.getElementById('amount').value),
    dateFrom: document.getElementById('dateFrom').value,
    dateTo: document.getElementById('dateTo').value,
  };
}

async function renderReportsPage(context) {
  const state = await loadState(context);
  const { accounts, transactions, budgets } = state;
  const summary = await Api.computeSummary(transactions, accounts);
  const categories = Api.groupExpensesByCategory(transactions);
  const flow = Api.groupTransactionsByDay(transactions);

  document.getElementById('reportsSummary').innerHTML = `
    <tr><th>Доходы</th><td>${Api.formatCurrency(summary.income)}</td></tr>
    <tr><th>Расходы</th><td>${Api.formatCurrency(summary.expenses)}</td></tr>
    <tr><th>Экономия</th><td>${Api.formatCurrency(summary.savings)}</td></tr>
    <tr><th>Текущий баланс</th><td>${Api.formatCurrency(summary.totalBalance)}</td></tr>
  `;

  document.getElementById('forecastCards').innerHTML = budgets.length
    ? budgets.map((budget) => {
        const spent = categories.find((item) => item.key === budget.category)?.amount || 0;
        const remaining = toNumber(budget.limit) - spent;
        const status = remaining >= 0 ? 'Лимит соблюдается' : 'Есть перерасход';
        const text = remaining >= 0 ? `Остаток: ${Api.formatCurrency(remaining)}` : `Превышение: ${Api.formatCurrency(Math.abs(remaining))}`;
        return `
          <div class="forecast-card ${remaining >= 0 ? 'forecast-good' : 'forecast-bad'}">
            <div class="forecast-card-title">${budget.categoryName}</div>
            <div class="forecast-card-status">${status}</div>
            <div class="forecast-card-text">Потрачено: ${Api.formatCurrency(spent)}</div>
            <div class="forecast-card-text">Лимит: ${Api.formatCurrency(budget.limit)}</div>
            <div class="forecast-card-text fw-semibold mt-2">${text}</div>
          </div>
        `;
      }).join('')
    : '<div class="empty-state">Пока нет бюджетов для прогноза. Добавьте их в личном кабинете.</div>';

  document.getElementById('categoryProgress').innerHTML = categories.length
    ? [...categories].sort((a, b) => a.name.localeCompare(b.name, 'ru')).map((item) => {
        const budget = budgets.find((entry) => entry.category === item.key);
        const percent = budget?.limit > 0 ? Math.min(999, Math.round((item.amount / Number(budget.limit)) * 100)) : 0;
        return `
          <div class="mb-3 forecast-row">
            <div class="d-flex justify-content-between"><label class="form-label mb-1 fw-semibold">${item.name}</label><small>${Api.formatCurrency(item.amount)}</small></div>
            <div class="progress"><div class="progress-bar" style="width:${Math.min(percent, 100)}%">${percent}%</div></div>
            ${budget ? `<small class="text-muted">Лимит: ${Api.formatCurrency(budget.limit)}</small>` : '<small class="text-muted">Для этой категории лимит не задан</small>'}
          </div>
        `;
      }).join('')
    : '<div class="empty-state">Пока нет расходов по категориям. Добавьте транзакции на странице «Транзакции».</div>';

  const canvas = document.getElementById('flowChart');
  if (flowChart) flowChart.destroy();
  if (!flow.labels.length) {
    canvas.classList.add('d-none');
    document.getElementById('flowEmpty').classList.remove('d-none');
    return;
  }

  canvas.classList.remove('d-none');
  document.getElementById('flowEmpty').classList.add('d-none');
  flowChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: flow.labels,
      datasets: [
        { label: 'Доходы', data: flow.income },
        { label: 'Расходы', data: flow.expenses },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: palette.text }, grid: { color: palette.grid }, border: { color: palette.grid } },
        y: { ticks: { color: palette.text }, grid: { color: palette.grid }, border: { color: palette.grid } }
      },
      plugins: { legend: { position: 'bottom', labels: { color: palette.text } } }
    },
  });
}

async function renderIntegrationsPage(context) {
  const state = await loadState(context);
  const ruleForm = document.getElementById('ruleForm');
  fillCategorySelect(document.getElementById('ruleTargetCategory'), false);
  await refreshIntegrations(state);

  if (state.isDemo) {
    ruleForm.querySelectorAll('input, select, button').forEach((el) => { el.disabled = true; });
    showPageNotice('integrationNotice', 'В демо-режиме интеграции доступны только для просмотра.', 'info');
    return;
  }

  ruleForm.onsubmit = async (event) => {
    event.preventDefault();
    hidePageNotice('integrationNotice');

    const field = document.getElementById('ruleField').value;
    const operator = document.getElementById('ruleOperator').value;
    const value = document.getElementById('ruleValue').value.trim();
    const actionType = document.getElementById('ruleActionType').value;
    const categorySelect = document.getElementById('ruleTargetCategory');
    const categoryName = categorySelect.selectedOptions[0]?.text || '';

    if (!value) {
      showPageNotice('integrationNotice', 'Заполните значение для правила.', 'warning');
      return;
    }

    try {
      await Api.addRule({
        userId: state.user.id,
        field,
        operator,
        value,
        actionType,
        actionLabel: 'Относить в категорию',
        categoryId: categorySelect.value,
        categoryName,
        active: true,
      });
      ruleForm.reset();
      document.getElementById('ruleActionType').value = 'category';
      fillCategorySelect(document.getElementById('ruleTargetCategory'), false);
      showPageNotice('integrationNotice', 'Правило добавлено.', 'success');
      await refreshIntegrations(state);
    } catch (error) {
      showPageNotice('integrationNotice', error.message, 'danger');
    }
  };
}

async function refreshIntegrations(state) {
  const fresh = await loadState(state);
  state.rules = fresh.rules;
  state.banks = fresh.banks;

  document.getElementById('bankTable').innerHTML = state.banks.length
    ? state.banks.map((bank) => `
        <tr>
          <td>${bank.name}</td>
          <td><span class="badge ${bank.connected ? 'text-bg-success' : 'text-bg-secondary'}">${bank.connected ? 'Подключён' : 'Не подключён'}</span></td>
          <td>${bank.lastSync || 'Нет синхронизации'}</td>
          <td><button class="btn btn-sm ${bank.connected ? 'btn-outline-danger' : 'btn-outline-primary'}" disabled title="Кнопка показана только как элемент интерфейса">${bank.connected ? 'Отключить' : 'Подключить'}</button></td>
        </tr>
      `).join('')
    : '<tr><td colspan="4" class="text-center text-muted">Банки пока не добавлены</td></tr>';

  document.getElementById('rulesList').innerHTML = state.rules.length
    ? state.rules.map((rule) => `
        <li class="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div class="fw-semibold">${rule.actionLabel}: ${rule.categoryName}</div>
            <small class="text-muted">Если поле «${rule.field}» ${rule.operator} «${rule.value}»</small>
          </div>
          ${state.isDemo ? '<span class="text-muted">Только просмотр</span>' : `<button class="btn btn-sm btn-outline-danger" data-delete-rule="${rule.id}">Удалить</button>`}
        </li>
      `).join('')
    : '<li class="list-group-item text-muted">Правил пока нет</li>';

  if (state.isDemo) return;

  document.querySelectorAll('[data-delete-rule]').forEach((button) => {
    button.onclick = async () => {
      try {
        await Api.deleteRule(button.dataset.deleteRule);
        showPageNotice('integrationNotice', 'Правило удалено.', 'success');
        await refreshIntegrations(state);
      } catch (error) {
        showPageNotice('integrationNotice', error.message, 'danger');
      }
    };
  });
}
