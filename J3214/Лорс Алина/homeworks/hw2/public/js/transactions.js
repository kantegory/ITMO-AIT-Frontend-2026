(() => {
  const defaultFilters = { search:'', category:'', accountId:'', type:'', minAmount:'', maxAmount:'', dateFrom:'', dateTo:'', status:'', sort:'date_desc' };
  const state = { filters: { ...defaultFilters }, view:'table', page:1, perPage:8 };
  let detailsModal, editModal;
  const getCurrency = () => window.TarelkaStorage.getCurrentUser()?.currency || 'EUR';
  const html = (value) => window.TarelkaUI.escapeHtml(value);

  function getFilterTemplate(prefix) {
    const accounts = window.TarelkaStorage.getAccounts();
    const transactions = window.TarelkaStorage.getTransactions();
    const categories = [...new Set(transactions.map((item) => item.category))].sort((a,b) => a.localeCompare(b,'ru'));
    const id = (name) => `${prefix}-${name}`;
    return `<form class="filter-form transactions-filter-form" id="${id('transactionsFilterForm')}" aria-labelledby="${id('filterHeading')}"><div><h2 class="h5 filter-form__heading" id="${id('filterHeading')}">Фильтры</h2><p class="text-secondary mb-0">Гибкая фильтрация и сортировка списка операций.</p></div><div><label class="form-label" for="${id('filterSearch')}">Поиск</label><input class="form-control" id="${id('filterSearch')}" name="search" placeholder="Описание, категория, счёт" autocomplete="off"></div><div><label class="form-label" for="${id('filterCategory')}">Категория</label><select class="form-select" id="${id('filterCategory')}" name="category"><option value="">Все категории</option>${categories.map((category) => `<option value="${html(category)}">${html(category)}</option>`).join('')}</select></div><div><label class="form-label" for="${id('filterAccount')}">Счёт</label><select class="form-select" id="${id('filterAccount')}" name="accountId"><option value="">Все счета</option>${accounts.map((account) => `<option value="${html(account.id)}">${html(account.name)}</option>`).join('')}</select></div><div><label class="form-label" for="${id('filterType')}">Тип операции</label><select class="form-select" id="${id('filterType')}" name="type"><option value="">Все типы</option><option value="income">Доход</option><option value="expense">Расход</option><option value="transfer_in">Перевод входящий</option><option value="transfer_out">Перевод исходящий</option></select></div><div class="row g-3"><div class="col-sm-6"><label class="form-label" for="${id('filterMinAmount')}">Сумма от</label><input class="form-control" id="${id('filterMinAmount')}" name="minAmount" type="number" min="0" step="0.01"></div><div class="col-sm-6"><label class="form-label" for="${id('filterMaxAmount')}">Сумма до</label><input class="form-control" id="${id('filterMaxAmount')}" name="maxAmount" type="number" min="0" step="0.01"></div></div><div class="row g-3"><div class="col-sm-6"><label class="form-label" for="${id('filterDateFrom')}">Дата от</label><input class="form-control" id="${id('filterDateFrom')}" name="dateFrom" type="date"></div><div class="col-sm-6"><label class="form-label" for="${id('filterDateTo')}">Дата до</label><input class="form-control" id="${id('filterDateTo')}" name="dateTo" type="date"></div></div><div><label class="form-label" for="${id('filterStatus')}">Статус</label><select class="form-select" id="${id('filterStatus')}" name="status"><option value="">Все статусы</option><option value="completed">Завершена</option><option value="pending">В обработке</option></select></div><div><label class="form-label" for="${id('filterSort')}">Сортировка</label><select class="form-select" id="${id('filterSort')}" name="sort"><option value="date_desc">Сначала новые</option><option value="date_asc">Сначала старые</option><option value="amount_desc">Сумма по убыванию</option><option value="amount_asc">Сумма по возрастанию</option><option value="alpha_asc">По алфавиту А-Я</option><option value="alpha_desc">По алфавиту Я-А</option></select></div></form>`;
  }

  function injectFilters() {
    document.getElementById('desktopFiltersContainer').innerHTML = getFilterTemplate('desktop');
    document.getElementById('mobileFiltersContainer').innerHTML = getFilterTemplate('mobile');
    syncFilterForms();
    bindFilterForms();
  }

  function syncFilterForms() {
    ['desktopFiltersContainer','mobileFiltersContainer'].forEach((id) => {
      const container = document.getElementById(id);
      if (!container) return;
      Object.entries(state.filters).forEach(([key, value]) => {
        const field = container.querySelector(`[name="${key}"]`);
        if (field) field.value = value;
      });
    });
  }

  function bindFilterForms() {
    document.querySelectorAll('.transactions-filter-form').forEach((form) => {
      form.addEventListener('input', handleFilterChange);
      form.addEventListener('change', handleFilterChange);
    });
  }

  function handleFilterChange(event) {
    state.filters = { ...state.filters, ...Object.fromEntries(new FormData(event.currentTarget).entries()) };
    state.page = 1;
    syncFilterForms();
    renderTransactions();
  }

  const getFilteredTransactions = () => window.TarelkaStorage.filterTransactions(state.filters);

  function actionButtons(transaction) {
    const description = html(transaction.description);
    return `<div class="transaction-actions"><button class="btn btn-sm btn-outline-secondary" type="button" data-action="details" data-id="${html(transaction.id)}" aria-label="Открыть детали транзакции ${description}">Подробнее</button><button class="btn btn-sm btn-outline-primary" type="button" data-action="edit" data-id="${html(transaction.id)}" aria-label="Редактировать транзакцию ${description}">Редактировать</button><button class="btn btn-sm btn-outline-danger" type="button" data-action="delete" data-id="${html(transaction.id)}" aria-label="Удалить транзакцию ${description}">Удалить</button></div>`;
  }

  function renderTransactions() {
    const currency = getCurrency();
    const items = getFilteredTransactions();
    const count = items.length;
    const startIndex = (state.page - 1) * state.perPage;
    const pageItems = items.slice(startIndex, startIndex + state.perPage);
    document.getElementById('resultsCount').textContent = count;
    document.getElementById('paginationSummary').textContent = count ? `Показаны ${startIndex + 1}–${Math.min(startIndex + state.perPage, count)} из ${count}` : 'Нет записей';
    document.getElementById('transactionsTableBody').innerHTML = pageItems.map((transaction) => `<tr><td>${window.TarelkaUI.formatDate(transaction.date, { day:'2-digit', month:'2-digit', year:'numeric' })}</td><td><div class="fw-semibold">${html(transaction.description)}</div><div class="small text-secondary">${window.TarelkaUI.statusMarkup(transaction.status)}</div></td><td>${html(transaction.category)}</td><td>${html(transaction.accountName)}</td><td class="transaction-amount transaction-amount--${html(transaction.type.replace('_','-'))}">${['income','transfer_in'].includes(transaction.type) ? '+' : '-'}${window.TarelkaUI.formatCurrency(transaction.amount, currency)}</td><td>${window.TarelkaUI.typeLabel(transaction.type)}</td><td>${actionButtons(transaction)}</td></tr>`).join('');
    document.getElementById('transactionsCardsView').innerHTML = pageItems.map((transaction) => `<div class="col-12 col-md-6"><article class="transaction-card" aria-label="Транзакция ${html(transaction.description)}"><div class="transaction-card__top mb-3"><div><div class="transaction-card__title">${html(transaction.description)}</div><p class="transaction-card__meta">${window.TarelkaUI.formatDate(transaction.date, { day:'2-digit', month:'long', year:'numeric' })}</p></div><div class="transaction-amount transaction-amount--${html(transaction.type.replace('_','-'))}">${['income','transfer_in'].includes(transaction.type) ? '+' : '-'}${window.TarelkaUI.formatCurrency(transaction.amount, currency)}</div></div><div class="d-flex flex-wrap gap-2 mb-3"><span class="info-chip">${html(transaction.category)}</span><span class="info-chip">${html(transaction.accountName)}</span><span class="info-chip">${window.TarelkaUI.typeLabel(transaction.type)}</span></div><div class="transaction-card__bottom"><div>${window.TarelkaUI.statusMarkup(transaction.status)}</div>${actionButtons(transaction)}</div></article></div>`).join('');
    document.getElementById('transactionsEmptyState').classList.toggle('d-none', count !== 0);
    renderPagination(count);
  }

  function renderPagination(count) {
    const totalPages = Math.max(1, Math.ceil(count / state.perPage));
    if (state.page > totalPages) state.page = totalPages;
    const pagination = document.getElementById('paginationList');
    if (count <= state.perPage) { pagination.innerHTML = ''; return; }
    pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => `<li class="page-item ${pageNumber === state.page ? 'active' : ''}"><button class="page-link" type="button" data-page-number="${pageNumber}" aria-label="Открыть страницу ${pageNumber}" ${pageNumber === state.page ? 'aria-current="page"' : ''}>${pageNumber}</button></li>`).join('');
  }

  function toggleView() {
    state.view = state.view === 'table' ? 'cards' : 'table';
    document.getElementById('transactionsTableView').classList.toggle('d-none', state.view !== 'table');
    document.getElementById('transactionsCardsView').classList.toggle('d-none', state.view !== 'cards');
    document.getElementById('viewToggleText').textContent = state.view === 'table' ? 'Карточки' : 'Таблица';
    const icon = document.querySelector('#toggleViewBtn i');
    if (icon) icon.className = `bi bi-${state.view === 'table' ? 'grid-3x3-gap' : 'table'} me-2`;
    document.getElementById('toggleViewBtn').setAttribute('aria-pressed', state.view === 'cards' ? 'true' : 'false');
  }

  const getTransactionById = (id) => window.TarelkaStorage.filterTransactions().find((item) => item.id === id);

  function showDetails(id) {
    const t = getTransactionById(id);
    if (!t) return;
    const currency = getCurrency();
    document.getElementById('transactionDetailsBody').innerHTML = `<div class="d-flex flex-column gap-3"><div><span class="text-secondary">Описание</span><div class="fw-semibold">${html(t.description)}</div></div><div class="row g-3"><div class="col-sm-6"><span class="text-secondary">Дата</span><div>${window.TarelkaUI.formatDate(t.date)}</div></div><div class="col-sm-6"><span class="text-secondary">Счёт</span><div>${html(t.accountName)}</div></div><div class="col-sm-6"><span class="text-secondary">Категория</span><div>${html(t.category)}</div></div><div class="col-sm-6"><span class="text-secondary">Тип</span><div>${window.TarelkaUI.typeLabel(t.type)}</div></div><div class="col-sm-6"><span class="text-secondary">Сумма</span><div class="fw-semibold">${window.TarelkaUI.formatCurrency(t.amount, currency)}</div></div><div class="col-sm-6"><span class="text-secondary">Статус</span><div>${window.TarelkaUI.statusMarkup(t.status)}</div></div></div></div>`;
    detailsModal.show();
  }

  function fillEditOptions(typeValue = 'expense') {
    const accounts = window.TarelkaStorage.getAccounts();
    window.TarelkaUI.fillSelect(document.getElementById('editTransactionAccount'), accounts.map((account) => ({ value: account.id, label: `${account.name} · ${account.currency}` })));
    const typeOptions = [{ value:'income', label:'Доход' }, { value:'expense', label:'Расход' }, { value:'transfer_in', label:'Перевод входящий' }, { value:'transfer_out', label:'Перевод исходящий' }];
    window.TarelkaUI.fillSelect(document.getElementById('editTransactionType'), typeOptions);
    document.getElementById('editTransactionType').value = typeValue;
    const categories = typeValue === 'income' ? window.TarelkaData.categories.income : typeValue.includes('transfer') ? window.TarelkaData.categories.transfer : window.TarelkaData.categories.expense;
    window.TarelkaUI.fillSelect(document.getElementById('editTransactionCategory'), categories.map((c) => ({ value:c, label:c })));
  }

  function openEditModal(id) {
    const t = getTransactionById(id);
    if (!t) return;
    fillEditOptions(t.type);
    document.getElementById('editTransactionId').value = t.id;
    document.getElementById('editTransactionType').value = t.type;
    document.getElementById('editTransactionStatus').value = t.status;
    document.getElementById('editTransactionAccount').value = t.accountId;
    document.getElementById('editTransactionCategory').value = t.category;
    document.getElementById('editTransactionAmount').value = t.amount;
    document.getElementById('editTransactionDate').value = t.date;
    document.getElementById('editTransactionDescription').value = t.description;
    editModal.show();
  }

  function bindActions() {
    document.addEventListener('click', async (event) => {
      const actionButton = event.target.closest('[data-action]');
      if (actionButton) {
        const { action, id } = actionButton.dataset;
        if (action === 'details') showDetails(id);
        if (action === 'edit') openEditModal(id);
        if (action === 'delete' && confirm('Удалить выбранную транзакцию?')) {
          try {
            await window.TarelkaStorage.deleteTransaction(id); renderTransactions(); window.TarelkaUI.showToast('Транзакция удалена.');
          } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
        }
      }
      const pageButton = event.target.closest('[data-page-number]');
      if (pageButton) { state.page = Number(pageButton.dataset.pageNumber); renderTransactions(); }
    });

    document.getElementById('toggleViewBtn').addEventListener('click', toggleView);
    document.getElementById('resetFiltersBtn').addEventListener('click', () => { state.filters = { ...defaultFilters }; state.page = 1; syncFilterForms(); renderTransactions(); });
    document.getElementById('openCreateTransactionFromList').addEventListener('click', () => { window.location.href = 'dashboard.html'; });
    document.getElementById('editTransactionType').addEventListener('change', (event) => { fillEditOptions(event.target.value); document.getElementById('editTransactionType').value = event.target.value; });
    document.getElementById('editTransactionForm').addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = { type: document.getElementById('editTransactionType').value, status: document.getElementById('editTransactionStatus').value, accountId: document.getElementById('editTransactionAccount').value, category: document.getElementById('editTransactionCategory').value, amount: document.getElementById('editTransactionAmount').value, date: document.getElementById('editTransactionDate').value, description: document.getElementById('editTransactionDescription').value };
      try {
        await window.TarelkaStorage.updateTransaction(document.getElementById('editTransactionId').value, payload); editModal.hide(); renderTransactions(); window.TarelkaUI.showToast('Транзакция обновлена.');
      } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
    });
    document.getElementById('deleteTransactionBtn').addEventListener('click', async () => {
      const id = document.getElementById('editTransactionId').value;
      if (id && confirm('Удалить текущую транзакцию?')) {
        try {
          await window.TarelkaStorage.deleteTransaction(id); editModal.hide(); renderTransactions(); window.TarelkaUI.showToast('Транзакция удалена.');
        } catch (error) { window.TarelkaUI.showToast(error.message, 'danger'); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    if (document.body.dataset.page !== 'transactions') return;
    const user = await window.TarelkaStorage.initializeProtectedPage();
    if (!user) return;
    window.TarelkaUI.renderLayout();
    detailsModal = new bootstrap.Modal('#transactionDetailsModal');
    editModal = new bootstrap.Modal('#editTransactionModal');
    injectFilters();
    fillEditOptions();
    bindActions();
    renderTransactions();
  });
})();
