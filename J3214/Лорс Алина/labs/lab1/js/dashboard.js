(() => {
  let transactionModal, accountModal, budgetModal, transferModal;
  const getCurrency = () => window.TarelkaStorage.getCurrentUser()?.currency || 'EUR';
  const typeIcon = (type) => ({ card: 'credit-card', savings: 'piggy-bank', cash: 'cash-coin', investment: 'graph-up-arrow' }[type] || 'wallet2');

  function renderSummary() {
    const metrics = window.TarelkaStorage.getDashboardMetrics();
    const currency = getCurrency();
    const currentUser = window.TarelkaStorage.getCurrentUser();
    document.getElementById('dashboardGreeting').textContent = `Добро пожаловать, ${currentUser.firstName}`;
    document.getElementById('dashboardDateText').textContent = `Сегодня ${window.TarelkaUI.formatDate(new Date())}`;

    const summaryCards = [
      { title: 'Общий баланс', value: window.TarelkaUI.formatCurrency(metrics.totalBalance, currency), meta: 'Сумма по всем счетам', icon: 'wallet2' },
      { title: 'Доходы за месяц', value: window.TarelkaUI.formatCurrency(metrics.monthlyIncome, currency), meta: 'Все завершённые поступления', icon: 'graph-up-arrow' },
      { title: 'Расходы за месяц', value: window.TarelkaUI.formatCurrency(metrics.monthlyExpenses, currency), meta: 'Все завершённые списания', icon: 'cart3' },
      { title: 'Выполнение бюджетов', value: `${metrics.budgetsProgress}%`, meta: 'Средний процент использования лимитов', icon: 'pie-chart' }
    ];
    document.getElementById('summaryCards').innerHTML = summaryCards.map((card) => `<div class="col-12 col-md-6 col-xl-3"><div class="card metric-card border-0 shadow-sm"><div class="card-body"><div class="d-flex justify-content-between gap-3"><div><div class="metric-card__title">${card.title}</div><div class="metric-card__value">${card.value}</div><p class="metric-card__meta">${card.meta}</p></div><div class="metric-card__icon"><i class="bi bi-${card.icon}"></i></div></div></div></div></div>`).join('');

    document.getElementById('accountsGrid').innerHTML = metrics.accounts.map((account) => `<div class="col-12 col-md-6"><article class="account-card"><div class="account-card__head"><div><div class="account-card__title">${account.name}</div><p class="account-card__meta">${window.TarelkaData.accountTypes[account.type] || account.type}</p></div><div class="account-card__icon"><i class="bi bi-${typeIcon(account.type)}"></i></div></div><div class="account-card__balance">${window.TarelkaUI.formatCurrency(account.currentBalance, account.currency)}</div><div class="d-flex justify-content-between align-items-center gap-3 flex-wrap"><span class="summary-chip"><i class="bi bi-cash-stack"></i>${account.currency}</span></div></article></div>`).join('');

    document.getElementById('recentTransactionsTable').innerHTML = metrics.recentTransactions.map((transaction) => `<tr><td>${window.TarelkaUI.formatDate(transaction.date, { day:'2-digit', month:'2-digit', year:'numeric' })}</td><td><div class="fw-semibold">${transaction.description}</div><div class="small text-secondary">${window.TarelkaUI.typeLabel(transaction.type)}</div></td><td>${transaction.category}</td><td class="transaction-amount transaction-amount--${transaction.type.replace('_','-')}">${['income','transfer_in'].includes(transaction.type) ? '+' : '-'}${window.TarelkaUI.formatCurrency(transaction.amount, currency)}</td><td>${window.TarelkaUI.statusMarkup(transaction.status)}</td></tr>`).join('');

    document.getElementById('budgetsList').innerHTML = metrics.budgets.map((budget) => {
      const percentage = budget.limit ? Math.round((budget.spent / budget.limit) * 100) : 0;
      const status = percentage > 100 ? 'exceeded' : percentage > 80 ? 'warning' : 'normal';
      const barClass = status === 'exceeded' ? 'bg-danger' : status === 'warning' ? 'bg-warning' : 'bg-success';
      return `<article class="budget-card"><div class="budget-card__head"><div><h3 class="h6 mb-1">${budget.category}</h3>${window.TarelkaUI.statusMarkup(status)}</div><button class="btn btn-sm btn-outline-primary edit-budget-btn" data-budget-id="${budget.id}">Редактировать</button></div><div class="budget-card__values"><div><span class="budget-card__value-label">Лимит</span><div class="budget-card__value">${window.TarelkaUI.formatCurrency(budget.limit, currency)}</div></div><div><span class="budget-card__value-label">Потрачено</span><div class="budget-card__value">${window.TarelkaUI.formatCurrency(budget.spent, currency)}</div></div><div><span class="budget-card__value-label">Остаток</span><div class="budget-card__value">${window.TarelkaUI.formatCurrency(Math.max(budget.limit - budget.spent, 0), currency)}</div></div></div><div class="progress mb-2"><div class="progress-bar ${barClass}" style="width:${Math.min(100, percentage)}%"></div></div><small class="text-secondary">${percentage}% от месячного лимита</small></article>`;
    }).join('');
  }

  function updateCategoryOptions(type) { const categories = type === 'income' ? window.TarelkaData.categories.income : window.TarelkaData.categories.expense; window.TarelkaUI.fillSelect(document.getElementById('transactionCategory'), categories.map((category) => ({ value: category, label: category }))); }
  function syncTransactionFormOptions() {
    const accounts = window.TarelkaStorage.getAccounts(); const options = accounts.map((account) => ({ value: account.id, label: `${account.name} · ${account.currency}` }));
    window.TarelkaUI.fillSelect(document.getElementById('transactionAccount'), options);
    window.TarelkaUI.fillSelect(document.getElementById('transferFrom'), options);
    window.TarelkaUI.fillSelect(document.getElementById('transferTo'), options);
    updateCategoryOptions(document.getElementById('transactionType')?.value || 'expense');
    document.getElementById('transferDate').value = new Date().toISOString().slice(0,10);
    document.getElementById('transactionDate').value = new Date().toISOString().slice(0,10);
  }

  function openTransactionModal(type = 'expense') { document.getElementById('transactionModalTitle').textContent = type === 'income' ? 'Новый доход' : 'Новый расход'; document.getElementById('transactionForm').reset(); document.getElementById('transactionType').value = type; document.getElementById('transactionStatus').value = 'completed'; document.getElementById('transactionDate').value = new Date().toISOString().slice(0,10); syncTransactionFormOptions(); updateCategoryOptions(type); transactionModal.show(); }
  function openBudgetModal(budgetId) { const budget = window.TarelkaStorage.getBudgets().find((item) => item.id === budgetId); if (!budget) return; document.getElementById('budgetId').value = budget.id; document.getElementById('budgetCategoryName').value = budget.category; document.getElementById('budgetLimit').value = budget.limit; budgetModal.show(); }

  function exportData() { const data = window.TarelkaStorage.exportUserData(); const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'tarelka-export.json'; anchor.click(); URL.revokeObjectURL(url); window.TarelkaUI.showToast('Экспорт данных подготовлен.'); }

  function initModals() {
    transactionModal = new bootstrap.Modal('#transactionModal'); accountModal = new bootstrap.Modal('#accountModal'); budgetModal = new bootstrap.Modal('#budgetModal'); transferModal = new bootstrap.Modal('#transferModal');
    document.getElementById('openAddTransactionModal').addEventListener('click', () => openTransactionModal());
    document.getElementById('openAddAccountModal').addEventListener('click', () => accountModal.show());
    document.getElementById('openTransferModal').addEventListener('click', () => transferModal.show());
    document.getElementById('transactionType').addEventListener('change', (event) => updateCategoryOptions(event.target.value));
    document.getElementById('budgetsList').addEventListener('click', (event) => { const button = event.target.closest('.edit-budget-btn'); if (button) openBudgetModal(button.dataset.budgetId); });
    document.querySelectorAll('[data-quick-action]').forEach((button) => button.addEventListener('click', () => { const action = button.dataset.quickAction; if (action === 'income') return openTransactionModal('income'); if (action === 'expense') return openTransactionModal('expense'); if (action === 'transfer') return transferModal.show(); if (action === 'export') return exportData(); }));

    document.getElementById('transactionForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = { type: document.getElementById('transactionType').value, status: document.getElementById('transactionStatus').value, accountId: document.getElementById('transactionAccount').value, category: document.getElementById('transactionCategory').value, amount: document.getElementById('transactionAmount').value, date: document.getElementById('transactionDate').value, description: document.getElementById('transactionDescription').value };
      if (!payload.accountId || !payload.category || !payload.description || Number(payload.amount) <= 0) return window.TarelkaUI.showToast('Заполните все поля транзакции корректно.', 'danger');
      window.TarelkaStorage.addTransaction(payload); transactionModal.hide(); renderSummary(); syncTransactionFormOptions(); window.TarelkaUI.showToast('Транзакция успешно сохранена.');
    });

    document.getElementById('accountForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = { name: document.getElementById('accountName').value, type: document.getElementById('accountType').value, initialBalance: document.getElementById('accountBalance').value, currency: document.getElementById('accountCurrency').value };
      if (!payload.name || Number(payload.initialBalance) < 0) return window.TarelkaUI.showToast('Введите корректные данные счёта.', 'danger');
      window.TarelkaStorage.addAccount(payload); document.getElementById('accountForm').reset(); accountModal.hide(); renderSummary(); syncTransactionFormOptions(); window.TarelkaUI.showToast('Новый счёт добавлен.');
    });

    document.getElementById('budgetForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const id = document.getElementById('budgetId').value, limit = document.getElementById('budgetLimit').value;
      if (Number(limit) <= 0) return window.TarelkaUI.showToast('Лимит бюджета должен быть больше нуля.', 'danger');
      window.TarelkaStorage.updateBudget(id, limit); budgetModal.hide(); renderSummary(); window.TarelkaUI.showToast('Бюджет обновлён.');
    });

    document.getElementById('transferForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const payload = { fromAccountId: document.getElementById('transferFrom').value, toAccountId: document.getElementById('transferTo').value, amount: document.getElementById('transferAmount').value, date: document.getElementById('transferDate').value, description: document.getElementById('transferDescription').value };
      if (!payload.fromAccountId || !payload.toAccountId || payload.fromAccountId === payload.toAccountId || Number(payload.amount) <= 0) return window.TarelkaUI.showToast('Укажите разные счета и корректную сумму перевода.', 'danger');
      window.TarelkaStorage.addTransfer(payload); document.getElementById('transferForm').reset(); transferModal.hide(); renderSummary(); syncTransactionFormOptions(); window.TarelkaUI.showToast('Перевод между счетами выполнен.');
    });
  }

  document.addEventListener('DOMContentLoaded', () => { if (document.body.dataset.page !== 'dashboard') return; window.TarelkaStorage.requireAuth(); renderSummary(); syncTransactionFormOptions(); initModals(); });
})();
