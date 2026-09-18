window.TarelkaStorage = (() => {
  const KEYS = {
    currentUser: 'currentUser',
    authToken: 'authToken',
    exchangeRates: 'exchangeRates',
    users: 'users',
    accounts: 'accounts',
    transactions: 'transactions',
    budgets: 'budgets',
    integrations: 'integrations',
    importRules: 'importRules',
    imports: 'imports'
  };

  const COLLECTION_KEYS = ['accounts', 'transactions', 'budgets', 'integrations', 'importRules', 'imports'];
  const ENDPOINTS = {
    accounts: '/accounts',
    transactions: '/transactions',
    budgets: '/budgets',
    integrations: '/integrations',
    importRules: '/importRules',
    imports: '/imports'
  };

  function read(key, fallback = []) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  const getCollection = (key) => read(KEYS[key], []);
  const saveCollection = (key, value) => write(KEYS[key], value);

  function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem(KEYS.currentUser)); } catch { return null; }
  }

  function setCurrentUser(user) {
    localStorage.setItem(KEYS.currentUser, JSON.stringify(user));
    return user;
  }

  function getAuthToken() {
    return localStorage.getItem(KEYS.authToken) || '';
  }

  function setAuthToken(token) {
    if (token) localStorage.setItem(KEYS.authToken, token);
    return token;
  }

  function clearCollectionCache() {
    COLLECTION_KEYS.forEach((key) => localStorage.removeItem(KEYS[key]));
  }

  function clearSession() {
    localStorage.removeItem(KEYS.currentUser);
    localStorage.removeItem(KEYS.authToken);
    clearCollectionCache();
  }

  const safeUser = (user) => {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  };

  function authHeaders(isJson = true) {
    const headers = {};
    if (isJson) headers['Content-Type'] = 'application/json';
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  function normalizeApiError(error) {
    const message = String(error?.message || '');
    if (message.includes('Failed to fetch')) return 'Не удалось JSON Server. `npm start` и открой http://localhost:3000.';
    if (/401|403|jwt|access denied|Unauthorized|Forbidden/i.test(message)) return 'Сессия истекла или доступ запрещён. Выполни вход заново.';
    if (/Email and password are required/i.test(message)) return 'Для входа или регистрации нужны email и пароль.';
    return error?.message || 'Произошла ошибка при работе с API.';
  }

  async function apiRequest(path, options = {}) {
    try {
      return await window.TarelkaApi.request(path, options);
    } catch (error) {
      throw new Error(normalizeApiError(error));
    }
  }

  function upsertLocalEntity(key, entity) {
    const items = getCollection(key);
    const index = items.findIndex((item) => item.id === entity.id);
    if (index === -1) items.push(entity); else items[index] = entity;
    saveCollection(key, items);
    return entity;
  }

  function removeLocalEntity(key, id) {
    const items = getCollection(key);
    const next = items.filter((item) => item.id !== id);
    saveCollection(key, next);
    return next.length !== items.length;
  }

  function requireAuth() {
    const user = getCurrentUser();
    const token = getAuthToken();
    if (!user || !token) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  }

  async function syncCollections(userId = getCurrentUser()?.id) {
    if (!userId) return null;
    const entries = await Promise.all(
      COLLECTION_KEYS.map(async (key) => {
        const endpoint = ENDPOINTS[key];
        const result = await apiRequest(`${endpoint}?userId=${encodeURIComponent(userId)}`, {
          headers: authHeaders(false)
        });
        return [key, Array.isArray(result) ? result : []];
      })
    );
    entries.forEach(([key, value]) => saveCollection(key, value));
    return Object.fromEntries(entries);
  }

  async function initializeProtectedPage() {
    const user = requireAuth();
    if (!user) return null;
    try {
      await syncCollections(user.id);
      return user;
    } catch (error) {
      clearSession();
      window.TarelkaUI?.showToast?.(error.message, 'danger');
      window.location.href = 'index.html';
      return null;
    }
  }

  async function registerUser(payload) {
    const body = {
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      currency: payload.currency,
      monthlyGoal: Number(payload.monthlyGoal) || 30000,
      createdAt: new Date().toISOString()
    };
    const response = await apiRequest('/register', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    const user = safeUser(response.user);
    setAuthToken(response.accessToken);
    setCurrentUser(user);
    await seedUserData(user);
    await syncCollections(user.id);
    return user;
  }

  async function login(email, password) {
    const response = await apiRequest('/login', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ email: email.trim().toLowerCase(), password })
    });
    const user = safeUser(response.user);
    setAuthToken(response.accessToken);
    setCurrentUser(user);
    await syncCollections(user.id);
    return user;
  }

  function logout() {
    clearSession();
    window.location.href = 'index.html';
  }

  async function postEntity(key, entity) {
    const created = await apiRequest(ENDPOINTS[key], {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(entity)
    });
    return upsertLocalEntity(key, created);
  }

  async function patchEntity(key, id, changes) {
    const updated = await apiRequest(`${ENDPOINTS[key]}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(changes)
    });
    return upsertLocalEntity(key, updated);
  }

  async function deleteEntity(key, id) {
    await apiRequest(`${ENDPOINTS[key]}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(false)
    });
    return removeLocalEntity(key, id);
  }

  async function seedUserData(user) {
    const seed = window.TarelkaData.createDemoSeed(user.id, user.currency, user.monthlyGoal);
    for (const [key, items] of Object.entries(seed)) {
      const normalizedKey = key === 'importRules' ? 'importRules' : key;
      for (const item of items) {
        await postEntity(normalizedKey, item);
      }
    }
  }

  const getUserItems = (key, userId = getCurrentUser()?.id) => getCollection(key).filter((item) => item.userId === userId);
  const getAccounts = (userId) => getUserItems('accounts', userId);
  const getTransactions = (userId) => getUserItems('transactions', userId);
  const getBudgets = (userId) => getUserItems('budgets', userId);
  const getIntegrations = (userId) => getUserItems('integrations', userId);
  const getImportRules = (userId) => getUserItems('importRules', userId);
  const getImports = (userId) => getUserItems('imports', userId).sort((a, b) => new Date(b.importedAt) - new Date(a.importedAt));

  async function addAccount(payload, userId = getCurrentUser()?.id) {
    return postEntity('accounts', {
      id: crypto.randomUUID(),
      userId,
      name: payload.name.trim(),
      type: payload.type,
      currency: payload.currency,
      initialBalance: Number(payload.initialBalance) || 0
    });
  }

  async function addTransaction(payload, userId = getCurrentUser()?.id) {
    return postEntity('transactions', {
      id: crypto.randomUUID(),
      userId,
      accountId: payload.accountId,
      date: payload.date,
      description: payload.description.trim(),
      category: payload.category,
      amount: Number(payload.amount),
      type: payload.type,
      status: payload.status || 'completed'
    });
  }

  async function addTransfer(payload, userId = getCurrentUser()?.id) {
    const linkId = crypto.randomUUID();
    const outgoing = await postEntity('transactions', {
      id: crypto.randomUUID(),
      userId,
      accountId: payload.fromAccountId,
      date: payload.date,
      description: payload.description.trim(),
      category: 'Перевод',
      amount: Number(payload.amount),
      type: 'transfer_out',
      status: 'completed',
      linkedTransferId: linkId
    });
    const incoming = await postEntity('transactions', {
      id: crypto.randomUUID(),
      userId,
      accountId: payload.toAccountId,
      date: payload.date,
      description: payload.description.trim(),
      category: 'Перевод',
      amount: Number(payload.amount),
      type: 'transfer_in',
      status: 'completed',
      linkedTransferId: linkId
    });
    return { outgoing, incoming };
  }

  async function updateTransaction(id, payload) {
    return patchEntity('transactions', id, {
      accountId: payload.accountId,
      date: payload.date,
      description: payload.description.trim(),
      category: payload.category,
      amount: Number(payload.amount),
      type: payload.type,
      status: payload.status
    });
  }

  async function deleteTransaction(id) {
    const transactions = getCollection('transactions');
    const target = transactions.find((item) => item.id === id);
    if (!target) return false;
    if (target.linkedTransferId) {
      const related = transactions.filter((item) => item.linkedTransferId === target.linkedTransferId);
      for (const item of related) {
        await deleteEntity('transactions', item.id);
      }
      return true;
    }
    return deleteEntity('transactions', id);
  }

  async function updateBudget(id, limit) {
    return patchEntity('budgets', id, { limit: Number(limit) });
  }

  async function toggleIntegration(id, connected, extra = {}) {
    const current = getCollection('integrations').find((item) => item.id === id);
    return patchEntity('integrations', id, {
      connected,
      tokenPreview: extra.tokenPreview ?? current?.tokenPreview ?? '',
      lastSync: connected ? (extra.lastSync || new Date().toISOString().slice(0, 16)) : ''
    });
  }

  async function addImportRule(payload, userId = getCurrentUser()?.id) {
    return postEntity('importRules', {
      id: crypto.randomUUID(),
      userId,
      conditionType: payload.conditionType,
      keyword: payload.keyword || '',
      threshold: payload.threshold ? Number(payload.threshold) : null,
      actionType: payload.actionType,
      actionValue: payload.actionValue.trim()
    });
  }

  async function deleteImportRule(id) {
    return deleteEntity('importRules', id);
  }

  async function addImportHistory(payload, userId = getCurrentUser()?.id) {
    return postEntity('imports', {
      id: crypto.randomUUID(),
      userId,
      format: payload.format,
      importedCount: payload.importedCount,
      sourceName: payload.sourceName,
      importedAt: payload.importedAt || new Date().toISOString()
    });
  }

  function applyRulesToTransaction(transaction, rules) {
    const result = { ...transaction };
    rules.forEach((rule) => {
      if (rule.conditionType === 'keyword' && rule.keyword && result.description.toLowerCase().includes(rule.keyword.toLowerCase())) {
        if (rule.actionType === 'category') result.category = rule.actionValue;
        if (rule.actionType === 'label') result.description = `${result.description} [${rule.actionValue}]`;
      }
      if (rule.conditionType === 'amount' && rule.threshold && Number(result.amount) > Number(rule.threshold)) {
        if (rule.actionType === 'category') result.category = rule.actionValue;
        if (rule.actionType === 'label') result.description = `${result.description} [${rule.actionValue}]`;
      }
    });
    return result;
  }

  async function importTransactions(rows, accountId, format, sourceName, userId = getCurrentUser()?.id) {
    const rules = getImportRules(userId);
    const preparedRows = rows
      .filter((row) => row.date && row.description && row.amount)
      .map((row) => applyRulesToTransaction({
        accountId,
        date: row.date,
        description: row.description,
        category: row.category || (row.type === 'income' ? 'Доход без категории' : 'Расход без категории'),
        amount: Number(row.amount),
        type: row.type === 'income' ? 'income' : 'expense',
        status: row.status || 'completed'
      }, rules));

    for (const row of preparedRows) {
      await addTransaction(row, userId);
    }
    await addImportHistory({ format, importedCount: preparedRows.length, sourceName }, userId);
    return preparedRows;
  }

  function getAccountBalance(account, transactions) {
    const relevant = transactions.filter((item) => item.accountId === account.id && item.status !== 'cancelled');
    const delta = relevant.reduce((sum, item) => {
      if (['income', 'transfer_in'].includes(item.type)) return sum + Number(item.amount);
      if (['expense', 'transfer_out'].includes(item.type)) return sum - Number(item.amount);
      return sum;
    }, 0);
    return Number(account.initialBalance) + delta;
  }

  function getDashboardMetrics(userId = getCurrentUser()?.id) {
    const accounts = getAccounts(userId);
    const transactions = getTransactions(userId);
    const budgets = getBudgets(userId);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalBalance = accounts.reduce((sum, account) => sum + getAccountBalance(account, transactions), 0);
    const monthlyIncome = monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
    const monthlyExpenses = monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
    const budgetsWithSpent = budgets.map((budget) => ({
      ...budget,
      spent: monthTransactions
        .filter((item) => item.type === 'expense' && item.category === budget.category)
        .reduce((sum, item) => sum + Number(item.amount), 0)
    }));
    const budgetsProgress = budgetsWithSpent.length
      ? Math.round(budgetsWithSpent.reduce((sum, item) => sum + Math.min(100, (item.spent / item.limit) * 100), 0) / budgetsWithSpent.length)
      : 0;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      budgetsProgress,
      accounts: accounts.map((account) => ({ ...account, currentBalance: getAccountBalance(account, transactions) })),
      recentTransactions: [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
      budgets: budgetsWithSpent
    };
  }

  function filterTransactions(filters = {}, userId = getCurrentUser()?.id) {
    const accounts = getAccounts(userId);
    const accountMap = Object.fromEntries(accounts.map((account) => [account.id, account]));
    let items = getTransactions(userId).map((transaction) => ({
      ...transaction,
      accountName: accountMap[transaction.accountId]?.name || 'Без счёта'
    }));

    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter((item) => [item.description, item.category, item.accountName].some((value) => String(value).toLowerCase().includes(search)));
    }
    if (filters.category) items = items.filter((item) => item.category === filters.category);
    if (filters.accountId) items = items.filter((item) => item.accountId === filters.accountId);
    if (filters.type) items = items.filter((item) => item.type === filters.type);
    if (filters.status) items = items.filter((item) => item.status === filters.status);
    if (filters.minAmount) items = items.filter((item) => Number(item.amount) >= Number(filters.minAmount));
    if (filters.maxAmount) items = items.filter((item) => Number(item.amount) <= Number(filters.maxAmount));
    if (filters.dateFrom) items = items.filter((item) => item.date >= filters.dateFrom);
    if (filters.dateTo) items = items.filter((item) => item.date <= filters.dateTo);

    const sort = filters.sort || 'date_desc';
    items.sort((a, b) => ({
      date_asc: new Date(a.date) - new Date(b.date),
      amount_desc: Number(b.amount) - Number(a.amount),
      amount_asc: Number(a.amount) - Number(b.amount),
      alpha_asc: a.description.localeCompare(b.description, 'ru'),
      alpha_desc: b.description.localeCompare(a.description, 'ru'),
      date_desc: new Date(b.date) - new Date(a.date)
    }[sort] ?? new Date(b.date) - new Date(a.date)));

    return items;
  }

  function getReportRange(period) {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);
    end.setHours(23, 59, 59, 999);
    if (period === 'week') start.setDate(now.getDate() - 6);
    if (period === 'month') start.setMonth(now.getMonth() - 1);
    if (period === 'quarter') start.setMonth(now.getMonth() - 3);
    if (period === 'year') start.setFullYear(now.getFullYear() - 1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }

  function getReportData(period = 'month', userId = getCurrentUser()?.id) {
    const transactions = getTransactions(userId);
    const budgets = getBudgets(userId);
    const range = getReportRange(period);
    const inRange = transactions.filter((item) => {
      const date = new Date(item.date);
      return date >= range.start && date <= range.end;
    });
    const expenses = inRange.filter((item) => item.type === 'expense');
    const income = inRange.filter((item) => item.type === 'income');
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);
    const averageCheck = expenses.length ? totalExpense / expenses.length : 0;
    const categoryTotals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + Number(item.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['—', 0];

    const monthlyBuckets = {};
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyBuckets[key] = {
        label: date.toLocaleDateString('ru-RU', { month: 'short' }),
        income: 0,
        expense: 0
      };
    }

    transactions.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyBuckets[key]) return;
      if (item.type === 'income') monthlyBuckets[key].income += Number(item.amount);
      if (item.type === 'expense') monthlyBuckets[key].expense += Number(item.amount);
    });

    const trendMap = {};
    inRange.forEach((item) => {
      if (item.type !== 'expense') return;
      const label = new Date(item.date).toLocaleDateString('ru-RU', period === 'year' ? { month: 'short' } : { day: '2-digit', month: '2-digit' });
      trendMap[label] = (trendMap[label] || 0) + Number(item.amount);
    });

    const budgetsProgress = budgets.map((budget) => ({
      ...budget,
      spent: expenses.filter((item) => item.category === budget.category).reduce((sum, item) => sum + Number(item.amount), 0)
    }));

    return { period, range, totalExpense, totalIncome, topCategory, averageCheck, categoryTotals, monthlyBuckets, trendMap, budgetsProgress, expenseCount: expenses.length };
  }

  function exportUserData(userId = getCurrentUser()?.id) {
    return {
      user: getCurrentUser(),
      accounts: getAccounts(userId),
      transactions: getTransactions(userId),
      budgets: getBudgets(userId),
      integrations: getIntegrations(userId),
      importRules: getImportRules(userId),
      imports: getImports(userId)
    };
  }

  function resetAll() {
    clearSession();
    localStorage.removeItem(KEYS.exchangeRates);
  }

  function getExchangeRatesCache() {
    try { return JSON.parse(localStorage.getItem(KEYS.exchangeRates)); } catch { return null; }
  }

  async function fetchExchangeRates(baseCurrency = getCurrentUser()?.currency || 'EUR') {
    const quotes = ['EUR', 'USD', 'RUB'].filter((item) => item !== baseCurrency);
    try {
      const result = await window.TarelkaApi.fetchExchangeRates(baseCurrency, quotes);
      const payload = {
        base: baseCurrency,
        updatedAt: new Date().toISOString(),
        rates: Array.isArray(result) ? result : []
      };
      write(KEYS.exchangeRates, payload);
      return payload;
    } catch (error) {
      const cached = getExchangeRatesCache();
      if (cached) return cached;
      throw new Error(normalizeApiError(error));
    }
  }

  return {
    KEYS,
    getCollection,
    saveCollection,
    getCurrentUser,
    setCurrentUser,
    getAuthToken,
    setAuthToken,
    registerUser,
    login,
    logout,
    requireAuth,
    initializeProtectedPage,
    syncCollections,
    getAccounts,
    getTransactions,
    getBudgets,
    getIntegrations,
    getImportRules,
    getImports,
    addAccount,
    addTransaction,
    addTransfer,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    toggleIntegration,
    addImportRule,
    deleteImportRule,
    importTransactions,
    getDashboardMetrics,
    filterTransactions,
    getReportData,
    exportUserData,
    getAccountBalance,
    fetchExchangeRates,
    getExchangeRatesCache,
    resetAll
  };
})();
