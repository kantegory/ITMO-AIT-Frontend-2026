window.TarelkaStorage = (() => {
  const KEYS = { currentUser: 'currentUser', users: 'users', accounts: 'accounts', transactions: 'transactions', budgets: 'budgets', integrations: 'integrations', importRules: 'importRules', imports: 'imports' };
  function read(key) { try { return JSON.parse(localStorage.getItem(key)) ?? []; } catch { return []; } }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); return value; }
  const getCollection = (key) => read(KEYS[key]);
  const saveCollection = (key, value) => write(KEYS[key], value);
  function getCurrentUser() { try { return JSON.parse(localStorage.getItem(KEYS.currentUser)); } catch { return null; } }
  function setCurrentUser(user) { localStorage.setItem(KEYS.currentUser, JSON.stringify(user)); return user; }
  function clearCurrentUser() { localStorage.removeItem(KEYS.currentUser); }
  const safeUser = (user) => { if (!user) return null; const { password, ...rest } = user; return rest; };

  function registerUser(payload) {
    const users = getCollection('users');
    const email = payload.email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === email)) throw new Error('Пользователь с таким email уже существует.');
    const user = { id: crypto.randomUUID(), firstName: payload.firstName.trim(), lastName: payload.lastName.trim(), email, password: payload.password, currency: payload.currency, monthlyGoal: Number(payload.monthlyGoal) || 30000, createdAt: new Date().toISOString() };
    users.push(user); saveCollection('users', users);
    const seed = window.TarelkaData.createDemoSeed(user.id, user.currency, user.monthlyGoal);
    saveCollection('accounts', getCollection('accounts').concat(seed.accounts));
    saveCollection('transactions', getCollection('transactions').concat(seed.transactions));
    saveCollection('budgets', getCollection('budgets').concat(seed.budgets));
    saveCollection('integrations', getCollection('integrations').concat(seed.integrations));
    saveCollection('importRules', getCollection('importRules').concat(seed.importRules));
    saveCollection('imports', getCollection('imports').concat(seed.imports));
    setCurrentUser(safeUser(user));
    return safeUser(user);
  }

  function login(email, password) {
    const users = getCollection('users');
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (!user) throw new Error('Неверный email или пароль.');
    setCurrentUser(safeUser(user));
    return safeUser(user);
  }

  function requireAuth() { const user = getCurrentUser(); if (!user) { window.location.href = 'index.html'; return null; } return user; }
  function logout() { clearCurrentUser(); window.location.href = 'index.html'; }
  const getUserItems = (key, userId = getCurrentUser()?.id) => getCollection(key).filter((item) => item.userId === userId);
  const getAccounts = (userId) => getUserItems('accounts', userId);
  const getTransactions = (userId) => getUserItems('transactions', userId);
  const getBudgets = (userId) => getUserItems('budgets', userId);
  const getIntegrations = (userId) => getUserItems('integrations', userId);
  const getImportRules = (userId) => getUserItems('importRules', userId);
  const getImports = (userId) => getUserItems('imports', userId).sort((a, b) => new Date(b.importedAt) - new Date(a.importedAt));

  function saveEntity(key, entity) { const items = getCollection(key); items.push(entity); saveCollection(key, items); return entity; }
  function updateEntity(key, id, updater) { const items = getCollection(key); const index = items.findIndex((item) => item.id === id); if (index === -1) return null; items[index] = typeof updater === 'function' ? updater(items[index]) : { ...items[index], ...updater }; saveCollection(key, items); return items[index]; }
  function removeEntity(key, id) { const items = getCollection(key); const next = items.filter((item) => item.id !== id); saveCollection(key, next); return next.length !== items.length; }

  const addAccount = (payload, userId = getCurrentUser()?.id) => saveEntity('accounts', { id: crypto.randomUUID(), userId, name: payload.name.trim(), type: payload.type, currency: payload.currency, initialBalance: Number(payload.initialBalance) || 0 });
  const addTransaction = (payload, userId = getCurrentUser()?.id) => saveEntity('transactions', { id: crypto.randomUUID(), userId, accountId: payload.accountId, date: payload.date, description: payload.description.trim(), category: payload.category, amount: Number(payload.amount), type: payload.type, status: payload.status || 'completed' });
  function addTransfer(payload, userId = getCurrentUser()?.id) {
    const linkId = crypto.randomUUID();
    const outgoing = saveEntity('transactions', { id: crypto.randomUUID(), userId, accountId: payload.fromAccountId, date: payload.date, description: payload.description.trim(), category: 'Перевод', amount: Number(payload.amount), type: 'transfer_out', status: 'completed', linkedTransferId: linkId });
    const incoming = saveEntity('transactions', { id: crypto.randomUUID(), userId, accountId: payload.toAccountId, date: payload.date, description: payload.description.trim(), category: 'Перевод', amount: Number(payload.amount), type: 'transfer_in', status: 'completed', linkedTransferId: linkId });
    return { outgoing, incoming };
  }
  const updateTransaction = (id, payload) => updateEntity('transactions', id, (current) => ({ ...current, accountId: payload.accountId, date: payload.date, description: payload.description.trim(), category: payload.category, amount: Number(payload.amount), type: payload.type, status: payload.status }));
  function deleteTransaction(id) { const transactions = getCollection('transactions'); const target = transactions.find((item) => item.id === id); if (!target) return false; if (target.linkedTransferId) { saveCollection('transactions', transactions.filter((item) => item.id !== id && item.linkedTransferId !== target.linkedTransferId)); return true; } return removeEntity('transactions', id); }
  const updateBudget = (id, limit) => updateEntity('budgets', id, { limit: Number(limit) });
  const toggleIntegration = (id, connected, extra = {}) => updateEntity('integrations', id, (current) => ({ ...current, connected, tokenPreview: extra.tokenPreview ?? current.tokenPreview, lastSync: connected ? (extra.lastSync || new Date().toISOString().slice(0,16)) : '' }));
  const addImportRule = (payload, userId = getCurrentUser()?.id) => saveEntity('importRules', { id: crypto.randomUUID(), userId, conditionType: payload.conditionType, keyword: payload.keyword || '', threshold: payload.threshold ? Number(payload.threshold) : null, actionType: payload.actionType, actionValue: payload.actionValue.trim() });
  const deleteImportRule = (id) => removeEntity('importRules', id);
  const addImportHistory = (payload, userId = getCurrentUser()?.id) => saveEntity('imports', { id: crypto.randomUUID(), userId, format: payload.format, importedCount: payload.importedCount, sourceName: payload.sourceName, importedAt: payload.importedAt || new Date().toISOString() });

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

  function importTransactions(rows, accountId, format, sourceName, userId = getCurrentUser()?.id) {
    const rules = getImportRules(userId);
    const preparedRows = rows.filter((row) => row.date && row.description && row.amount).map((row) => applyRulesToTransaction({ accountId, date: row.date, description: row.description, category: row.category || (row.type === 'income' ? 'Доход без категории' : 'Расход без категории'), amount: Number(row.amount), type: row.type === 'income' ? 'income' : 'expense', status: row.status || 'completed' }, rules));
    preparedRows.forEach((row) => addTransaction(row, userId));
    addImportHistory({ format, importedCount: preparedRows.length, sourceName }, userId);
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
    const accounts = getAccounts(userId), transactions = getTransactions(userId), budgets = getBudgets(userId);
    const now = new Date(), currentMonth = now.getMonth(), currentYear = now.getFullYear();
    const monthTransactions = transactions.filter((item) => { const date = new Date(item.date); return date.getMonth() === currentMonth && date.getFullYear() === currentYear; });
    const totalBalance = accounts.reduce((sum, account) => sum + getAccountBalance(account, transactions), 0);
    const monthlyIncome = monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
    const monthlyExpenses = monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
    const budgetsWithSpent = budgets.map((budget) => ({ ...budget, spent: monthTransactions.filter((item) => item.type === 'expense' && item.category === budget.category).reduce((sum, item) => sum + Number(item.amount), 0) }));
    const budgetsProgress = budgetsWithSpent.length ? Math.round(budgetsWithSpent.reduce((sum, item) => sum + Math.min(100, (item.spent / item.limit) * 100), 0) / budgetsWithSpent.length) : 0;
    return { totalBalance, monthlyIncome, monthlyExpenses, budgetsProgress, accounts: accounts.map((account) => ({ ...account, currentBalance: getAccountBalance(account, transactions) })), recentTransactions: [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6), budgets: budgetsWithSpent };
  }

  function filterTransactions(filters = {}, userId = getCurrentUser()?.id) {
    const accounts = getAccounts(userId), accountMap = Object.fromEntries(accounts.map((account) => [account.id, account]));
    let items = getTransactions(userId).map((transaction) => ({ ...transaction, accountName: accountMap[transaction.accountId]?.name || 'Без счёта' }));
    if (filters.search) { const search = filters.search.toLowerCase(); items = items.filter((item) => [item.description, item.category, item.accountName].some((value) => String(value).toLowerCase().includes(search))); }
    if (filters.category) items = items.filter((item) => item.category === filters.category);
    if (filters.accountId) items = items.filter((item) => item.accountId === filters.accountId);
    if (filters.type) items = items.filter((item) => item.type === filters.type);
    if (filters.status) items = items.filter((item) => item.status === filters.status);
    if (filters.minAmount) items = items.filter((item) => Number(item.amount) >= Number(filters.minAmount));
    if (filters.maxAmount) items = items.filter((item) => Number(item.amount) <= Number(filters.maxAmount));
    if (filters.dateFrom) items = items.filter((item) => item.date >= filters.dateFrom);
    if (filters.dateTo) items = items.filter((item) => item.date <= filters.dateTo);
    const sort = filters.sort || 'date_desc';
    items.sort((a, b) => ({ date_asc: new Date(a.date)-new Date(b.date), amount_desc: Number(b.amount)-Number(a.amount), amount_asc: Number(a.amount)-Number(b.amount), alpha_asc: a.description.localeCompare(b.description, 'ru'), alpha_desc: b.description.localeCompare(a.description, 'ru'), date_desc: new Date(b.date)-new Date(a.date) }[sort] ?? new Date(b.date)-new Date(a.date)));
    return items;
  }

  function getReportRange(period) {
    const now = new Date(), end = new Date(now), start = new Date(now); end.setHours(23,59,59,999);
    if (period === 'week') start.setDate(now.getDate() - 6);
    if (period === 'month') start.setMonth(now.getMonth() - 1);
    if (period === 'quarter') start.setMonth(now.getMonth() - 3);
    if (period === 'year') start.setFullYear(now.getFullYear() - 1);
    start.setHours(0,0,0,0); return { start, end };
  }

  function getReportData(period = 'month', userId = getCurrentUser()?.id) {
    const transactions = getTransactions(userId), budgets = getBudgets(userId), range = getReportRange(period);
    const inRange = transactions.filter((item) => { const date = new Date(item.date); return date >= range.start && date <= range.end; });
    const expenses = inRange.filter((item) => item.type === 'expense'), income = inRange.filter((item) => item.type === 'income');
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount), 0), totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0), averageCheck = expenses.length ? totalExpense / expenses.length : 0;
    const categoryTotals = expenses.reduce((acc, item) => { acc[item.category] = (acc[item.category] || 0) + Number(item.amount); return acc; }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['—', 0];
    const monthlyBuckets = {}; for (let i = 5; i >= 0; i -= 1) { const date = new Date(); date.setMonth(date.getMonth() - i); const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`; monthlyBuckets[key] = { label: date.toLocaleDateString('ru-RU', { month: 'short' }), income: 0, expense: 0 }; }
    transactions.forEach((item) => { const date = new Date(item.date); const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`; if (!monthlyBuckets[key]) return; if (item.type === 'income') monthlyBuckets[key].income += Number(item.amount); if (item.type === 'expense') monthlyBuckets[key].expense += Number(item.amount); });
    const trendMap = {}; inRange.forEach((item) => { if (item.type !== 'expense') return; const label = new Date(item.date).toLocaleDateString('ru-RU', period === 'year' ? { month: 'short' } : { day: '2-digit', month: '2-digit' }); trendMap[label] = (trendMap[label] || 0) + Number(item.amount); });
    const budgetsProgress = budgets.map((budget) => ({ ...budget, spent: expenses.filter((item) => item.category === budget.category).reduce((sum, item) => sum + Number(item.amount), 0) }));
    return { period, range, totalExpense, totalIncome, topCategory, averageCheck, categoryTotals, monthlyBuckets, trendMap, budgetsProgress, expenseCount: expenses.length };
  }

  function exportUserData(userId = getCurrentUser()?.id) { return { user: getCurrentUser(), accounts: getAccounts(userId), transactions: getTransactions(userId), budgets: getBudgets(userId), integrations: getIntegrations(userId), importRules: getImportRules(userId), imports: getImports(userId) }; }
  function resetAll() { Object.values(KEYS).forEach((key) => localStorage.removeItem(key)); }

  return { KEYS, getCollection, saveCollection, getCurrentUser, setCurrentUser, registerUser, login, logout, requireAuth, getAccounts, getTransactions, getBudgets, getIntegrations, getImportRules, getImports, addAccount, addTransaction, addTransfer, updateTransaction, deleteTransaction, updateBudget, toggleIntegration, addImportRule, deleteImportRule, importTransactions, getDashboardMetrics, filterTransactions, getReportData, exportUserData, getAccountBalance, resetAll };
})();
