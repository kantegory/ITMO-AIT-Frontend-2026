let dashboardTransactions = [];
let dashboardAccounts = {
  main: null,
  savings: null
};
let dashboardCurrentUser = null;

function isCurrentUserRecord(record, userId) {
  return String(record.userId) === String(userId);
}

function sortTransactionsByDateDesc(items) {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

function renderTransactions(items) {
  const tbody = document.getElementById('transactionsBody');
  const emptyState = document.getElementById('transactionsEmpty');

  if (!tbody) return;

  tbody.innerHTML = '';

  if (!items.length) {
    emptyState?.classList.remove('d-none');
    return;
  }

  emptyState?.classList.add('d-none');

  items.forEach((item) => {
    const typeText = item.type === 'income' ? 'Доход' : 'Расход';
    const amountClass = item.type === 'income' ? 'text-success' : 'text-danger';
    const amountPrefix = item.type === 'income' ? '+' : '-';

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>${item.description}</td>
        <td>
          <span class="badge ${item.type === 'income' ? 'text-bg-success' : 'text-bg-light'} rounded-pill">
            ${typeText}
          </span>
        </td>
        <td class="text-end fw-semibold ${amountClass}">
          ${amountPrefix} ${formatMoney(item.amount)}
        </td>
      </tr>
    `);
  });
}

function applyTransactionFilters() {
  const category = document.getElementById('categoryFilter')?.value.trim() || '';
  const amount = Number(document.getElementById('amountFilter')?.value) || 0;
  const date = document.getElementById('dateFilter')?.value || '';

  let filtered = [...dashboardTransactions];

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (amount) {
    filtered = filtered.filter((item) => Number(item.amount) >= amount);
  }

  if (date) {
    filtered = filtered.filter((item) => item.date === date);
  }

  renderTransactions(filtered);
  showToast('Фильтр применён');
}

function resetTransactionFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const amountFilter = document.getElementById('amountFilter');
  const dateFilter = document.getElementById('dateFilter');

  if (categoryFilter) categoryFilter.value = '';
  if (amountFilter) amountFilter.value = '';
  if (dateFilter) dateFilter.value = '';

  renderTransactions(dashboardTransactions);
  showToast('Фильтры сброшены');
}

function renderBudgets(budgets) {
  const container = document.getElementById('budgetsContainer');
  if (!container) return;

  if (!budgets.length) {
    container.innerHTML = `<p class="text-secondary mb-0">Бюджеты пока не добавлены.</p>`;
    return;
  }

  container.innerHTML = budgets.map((budget) => {
    const percent = Math.min(
      100,
      Math.round((Number(budget.spent) / Number(budget.limit)) * 100)
    );

    return `
      <div class="budget-progress mb-4">
        <div class="d-flex justify-content-between mb-2">
          <span>${budget.category}</span>
          <span class="text-secondary">${formatMoney(budget.spent)} / ${formatMoney(budget.limit)}</span>
        </div>
        <div class="progress">
          <div class="progress-bar ${budget.color || 'bg-primary'}" style="width:${percent}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

function updateAccountsUI(mainAccount, savingsAccount) {
  dashboardAccounts.main = mainAccount || null;
  dashboardAccounts.savings = savingsAccount || null;

  document.getElementById('accountTitle').textContent = mainAccount?.title || 'Основной счёт';
  document.getElementById('accountBalance').textContent = formatMoney(mainAccount?.balance || 0);
  document.getElementById('accountNumber').textContent = mainAccount?.number || 'Карта • **** 0000';
  document.getElementById('savingsValue').textContent = formatMoney(savingsAccount?.balance || 0);
}

async function patchAccountBalance(accountId, newBalance) {
  return apiRequest(`/accounts/${accountId}`, {
    method: 'PATCH',
    body: JSON.stringify({ balance: Number(newBalance.toFixed(2)) })
  });
}

async function loadDashboardData(user) {
  await ensureUserFinancialData(user.id);

  const [allAccounts, allTransactions, allBudgets] = await Promise.all([
    apiRequest('/accounts'),
    apiRequest('/transactions'),
    apiRequest('/budgets')
  ]);

  const accounts = allAccounts.filter((item) => isCurrentUserRecord(item, user.id));
  const transactions = sortTransactionsByDateDesc(
    allTransactions.filter((item) => isCurrentUserRecord(item, user.id))
  );
  const budgets = allBudgets.filter((item) => isCurrentUserRecord(item, user.id));

  dashboardTransactions = transactions;
  renderTransactions(transactions);
  renderBudgets(budgets);

  const mainAccount = accounts.find((item) => item.kind === 'main') || accounts[0];
  const savingsAccount = accounts.find((item) => item.kind === 'savings');

  updateAccountsUI(mainAccount, savingsAccount);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(currentMonth))
    .reduce((sum, item) => sum + Number(item.amount), 0);

  document.getElementById('expensesValue').textContent = formatMoney(monthExpenses);
}

async function processAccountOperation(type) {
  if (!dashboardCurrentUser) return;

  await ensureUserFinancialData(dashboardCurrentUser.id);
  await loadDashboardData(dashboardCurrentUser);

  const amountInput = document.getElementById('accountOperationAmount');
  const amount = Number(amountInput?.value);

  if (!amount || amount <= 0) {
    showToast('Введите сумму больше нуля');
    return;
  }

  const main = dashboardAccounts.main;
  const savings = dashboardAccounts.savings;

  if (!main || !savings) {
    showToast('Не найдены счета пользователя');
    return;
  }

  try {
    if (type === 'deposit-main') {
      await patchAccountBalance(main.id, Number(main.balance) + amount);
      showToast('Основной счёт пополнен');
    }

    if (type === 'move-to-savings') {
      if (Number(main.balance) < amount) {
        showToast('Недостаточно средств на основном счёте');
        return;
      }

      await patchAccountBalance(main.id, Number(main.balance) - amount);
      await patchAccountBalance(savings.id, Number(savings.balance) + amount);
      showToast('Средства переведены в сбережения');
    }

    if (type === 'withdraw-from-savings') {
      if (Number(savings.balance) < amount) {
        showToast('Недостаточно средств на счёте сбережений');
        return;
      }

      await patchAccountBalance(savings.id, Number(savings.balance) - amount);
      await patchAccountBalance(main.id, Number(main.balance) + amount);
      showToast('Средства переведены на основной счёт');
    }

    await loadDashboardData(dashboardCurrentUser);

    if (amountInput) amountInput.value = '';
  } catch (error) {
    console.error(error);
    showToast('Не удалось выполнить операцию');
  }
}

async function initDashboardPage() {
  const user = requireAuth();
  if (!user) return;

  dashboardCurrentUser = user;

  try {
    await loadDashboardData(user);

    document.getElementById('applyFiltersBtn')?.addEventListener('click', applyTransactionFilters);
    document.getElementById('resetFiltersBtn')?.addEventListener('click', resetTransactionFilters);

    document.getElementById('depositMainBtn')?.addEventListener('click', () => {
      processAccountOperation('deposit-main');
    });

    document.getElementById('moveToSavingsBtn')?.addEventListener('click', () => {
      processAccountOperation('move-to-savings');
    });

    document.getElementById('withdrawFromSavingsBtn')?.addEventListener('click', () => {
      processAccountOperation('withdraw-from-savings');
    });

    const transactionForm = document.getElementById('transactionForm');

    transactionForm?.addEventListener('submit', async (event) => {
      event.preventDefault();

      const newTransaction = {
        userId: user.id,
        description: document.getElementById('txDescription').value.trim(),
        category: document.getElementById('txCategory').value,
        amount: Number(document.getElementById('txAmount').value),
        type: document.getElementById('txType').value,
        date: document.getElementById('txDate').value
      };

      if (!newTransaction.description || !newTransaction.amount || !newTransaction.date) {
        showToast('Заполните все поля транзакции');
        return;
      }

      try {
        await apiRequest('/transactions', {
          method: 'POST',
          body: JSON.stringify(newTransaction)
        });

        await loadDashboardData(user);

        const modalEl = document.getElementById('transactionModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();

        transactionForm.reset();
        showToast('Транзакция добавлена');
      } catch (error) {
        showToast('Ошибка при добавлении транзакции');
        console.error(error);
      }
    });
  } catch (error) {
    showToast('Не удалось загрузить данные кабинета');
    console.error(error);
  }
}