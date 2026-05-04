const API_URL = 'http://localhost:3000';
const STORAGE_KEY = 'financeManagerAuth';
const FALLBACK_RATES = { USD: 90, EUR: 98 };
const EXCHANGE_RATE_CACHE_KEY = 'financeManagerExchangeRates';
const EXCHANGE_RATE_CACHE_TTL_MS = 60 * 60 * 1000;

const DEMO_DATA = {
  user: {
    id: 'demo',
    name: 'Демо-пользователь',
    email: 'demo@financemanager.local',
    joinedDate: '2026-03-01'
  },
  accounts: [
    { id: 1001, userId: 'demo', name: 'Основной счёт', bank: 'FinanceManager', type: 'debit', balance: 84250, currency: 'RUB', icon: 'bi-wallet2' },
    { id: 1002, userId: 'demo', name: 'Накопительный счёт', bank: 'Сбербанк', type: 'saving', balance: 150000, currency: 'RUB', icon: 'bi-piggy-bank' }
  ],
  transactions: [
    { id: 1001, userId: 'demo', accountId: 1001, date: '2026-03-11', description: 'Зарплата', category: 'income', categoryName: 'Доход', amount: 95000, type: 'income', icon: 'bi-arrow-down-circle' },
    { id: 1002, userId: 'demo', accountId: 1001, date: '2026-03-12', description: 'Пятёрочка', category: 'products', categoryName: 'Продукты', amount: -3850, type: 'expense', icon: 'bi-cart' },
    { id: 1003, userId: 'demo', accountId: 1001, date: '2026-03-13', description: 'АЗС Лукойл', category: 'transport', categoryName: 'Транспорт', amount: -2900, type: 'expense', icon: 'bi-car-front' },
    { id: 1004, userId: 'demo', accountId: 1001, date: '2026-03-14', description: 'Кинотеатр', category: 'entertainment', categoryName: 'Развлечения', amount: -1600, type: 'expense', icon: 'bi-film' },
    { id: 1005, userId: 'demo', accountId: 1001, date: '2026-03-15', description: 'Коммунальные услуги', category: 'utilities', categoryName: 'Коммуналка', amount: -5400, type: 'expense', icon: 'bi-lightning' }
  ],
  budgets: [
    { id: 1001, userId: 'demo', category: 'products', categoryName: 'Продукты', limit: 18000 },
    { id: 1002, userId: 'demo', category: 'transport', categoryName: 'Транспорт', limit: 8000 },
    { id: 1003, userId: 'demo', category: 'entertainment', categoryName: 'Развлечения', limit: 7000 },
    { id: 1004, userId: 'demo', category: 'utilities', categoryName: 'Коммуналка', limit: 9000 }
  ],
  rules: [
    { id: 1001, userId: 'demo', field: 'Описание операции', operator: 'содержит', value: 'Пятёрочка, Магнит', actionType: 'category', actionLabel: 'Относить в категорию', categoryId: 'products', categoryName: 'Продукты', active: true },
    { id: 1002, userId: 'demo', field: 'Описание операции', operator: 'содержит', value: 'АЗС, Лукойл', actionType: 'category', actionLabel: 'Относить в категорию', categoryId: 'transport', categoryName: 'Транспорт', active: true }
  ],
  banks: [
    { id: 1001, userId: 'demo', name: 'Сбербанк', connected: true, lastSync: '2 часа назад' },
    { id: 1002, userId: 'demo', name: 'Тинькофф', connected: true, lastSync: '5 часов назад' },
    { id: 1003, userId: 'demo', name: 'Альфа-Банк', connected: false, lastSync: null },
    { id: 1004, userId: 'demo', name: 'ВТБ', connected: false, lastSync: null },
    { id: 1005, userId: 'demo', name: 'Газпромбанк', connected: false, lastSync: null }
  ]
};

const CATEGORIES = [
  { value: 'income', label: 'Доход' },
  { value: 'products', label: 'Продукты' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'entertainment', label: 'Развлечения' },
  { value: 'utilities', label: 'Коммуналка' },
  { value: 'health', label: 'Здоровье' },
  { value: 'clothes', label: 'Одежда' },
  { value: 'other', label: 'Другое' }
];

function getAuth() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
}

function setAuth(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId: user.id, email: user.email, name: user.name }));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatCurrency(amount, currency = 'RUB') {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('ru-RU').format(new Date(dateStr));
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
  } catch (error) {
    throw new Error('Не удаётся подключиться к mock API. Запустите json-server командой npm run api.');
  }

  if (!response.ok) {
    let message = 'Ошибка запроса к серверу';
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (e) {
      try {
        const text = await response.text();
        if (text) message = text;
      } catch (e2) {}
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function pingApi() {
  try {
    await request('/users?_limit=1');
    return true;
  } catch (e) {
    if (/Failed to fetch/i.test(e.message)) {
      throw new Error('Не удаётся подключиться к mock API. Сначала запустите json-server командой npm run api.');
    }
    throw e;
  }
}

async function login(email, password) {
  await pingApi();
  const normalizedEmail = email.trim().toLowerCase();
  const users = await request('/users');
  const user = users.find((item) => item.email?.trim().toLowerCase() === normalizedEmail && String(item.password ?? '') === String(password));
  if (!user) throw new Error('Неверный email или пароль');
  setAuth(user);
  return user;
}

async function register(payload) {
  await pingApi();
  const normalizedEmail = payload.email.trim().toLowerCase();
  const users = await request('/users');
  const existing = users.find((item) => item.email?.trim().toLowerCase() === normalizedEmail);
  if (existing) throw new Error('Пользователь с таким email уже существует');

  const user = await request('/users', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.name,
      email: normalizedEmail,
      password: payload.password,
      verified: true,
      joinedDate: new Date().toISOString().slice(0, 10),
    }),
  });

  const bankCatalog = await request('/banks');

  await Promise.all([
    request('/accounts', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, name: 'Основной счёт', bank: 'FinanceManager', type: 'debit', balance: 0, currency: 'RUB', icon: 'bi-wallet2' }),
    }),
    request('/budgets', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, category: 'products', categoryName: 'Продукты', limit: 15000 }),
    }),
    request('/budgets', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, category: 'transport', categoryName: 'Транспорт', limit: 7000 }),
    }),
    request('/budgets', {
      method: 'POST',
      body: JSON.stringify({ userId: user.id, category: 'entertainment', categoryName: 'Развлечения', limit: 5000 }),
    }),
    ...bankCatalog.map((bank) => request('/userBanks', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id,
        name: bank.name,
        icon: bank.icon,
        color: bank.color,
        connected: false,
        lastSync: null,
        error: false,
      }),
    })),
  ]);

  setAuth(user);
  return user;
}

async function getCurrentUser() {
  const auth = getAuth();
  if (!auth?.userId) return null;
  try {
    const users = await request('/users');
    const user = users.find((item) => String(item.id) === String(auth.userId));
    if (!user) {
      clearAuth();
      return null;
    }
    return user;
  } catch (e) {
    clearAuth();
    return null;
  }
}

async function getPageContext() {
  const user = await getCurrentUser();
  return {
    isDemo: !user,
    user: user || DEMO_DATA.user,
  };
}

function byUserId(items = [], userId) {
  return items.filter((item) => String(item.userId) === String(userId));
}


function sortBudgetsByLimit(items = []) {
  return [...items].sort((a, b) => Number(b.limit || 0) - Number(a.limit || 0) || String(a.categoryName || '').localeCompare(String(b.categoryName || ''), 'ru'));
}

async function fetchExchangeRates() {
  const cachedRaw = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      if (cached.timestamp && Date.now() - cached.timestamp < EXCHANGE_RATE_CACHE_TTL_MS && cached.rates) {
        return { ...FALLBACK_RATES, ...cached.rates, source: 'cache' };
      }
    } catch (e) {}
  }

  try {
    const response = await fetch('https://open.er-api.com/v6/latest/RUB');
    if (!response.ok) throw new Error('Ошибка загрузки курса валют');
    const data = await response.json();
    const usd = data?.rates?.USD ? Number((1 / Number(data.rates.USD)).toFixed(4)) : FALLBACK_RATES.USD;
    const eur = data?.rates?.EUR ? Number((1 / Number(data.rates.EUR)).toFixed(4)) : FALLBACK_RATES.EUR;
    const rates = { USD: usd, EUR: eur };
    localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), rates }));
    return { ...FALLBACK_RATES, ...rates, source: 'api' };
  } catch (error) {
    return { ...FALLBACK_RATES, source: 'fallback' };
  }
}

function normalizeBudget(item) {
  return {
    ...item,
    limit: Number(item.limit || 0),
    categoryName: item.categoryName || CATEGORIES.find((entry) => entry.value === item.category)?.label || item.category || 'Без категории',
  };
}

function normalizeRule(item) {
  const value = item.value || item.keywords || '';
  return {
    ...item,
    field: item.field || 'Описание операции',
    operator: item.operator || 'содержит',
    value,
    actionType: item.actionType || 'category',
    actionLabel: item.actionLabel || 'Относить в категорию',
    categoryName: item.categoryName || CATEGORIES.find((entry) => entry.value === item.categoryId)?.label || 'Без категории',
  };
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function getRuleFieldValue(rule, payload) {
  const field = normalizeText(rule.field);
  if (field === 'описание операции') return String(payload.description || '');
  if (field === 'категория') return String(payload.categoryName || payload.category || '');
  return String(payload.description || '');
}

function isRuleMatched(rule, payload) {
  const source = normalizeText(getRuleFieldValue(rule, payload));
  const expected = normalizeText(rule.value);
  if (!source || !expected) return false;

  const operator = normalizeText(rule.operator);
  if (operator === 'содержит') return source.includes(expected);
  if (operator === 'начинается с') return source.startsWith(expected);
  if (operator === 'равно') return source === expected;
  return false;
}

async function applyRulesToTransaction(payload) {
  const rulesRaw = await request('/rules');
  const rules = byUserId(rulesRaw, payload.userId)
    .map(normalizeRule)
    .filter((rule) => rule.active !== false);

  const matchedRule = rules.find((rule) => rule.actionType === 'category' && rule.categoryId && isRuleMatched(rule, payload));
  if (!matchedRule) return payload;

  return {
    ...payload,
    category: matchedRule.categoryId,
    categoryName: matchedRule.categoryName,
    importRuleId: matchedRule.id,
    importRuleApplied: true,
  };
}
async function ensureUserSetup(userId) {
  const [accounts, userBanks, bankCatalog] = await Promise.all([
    request('/accounts'),
    request('/userBanks'),
    request('/banks'),
  ]);

  const userAccounts = byUserId(accounts, userId);
  const userBankItems = byUserId(userBanks, userId);
  const tasks = [];

  if (!userAccounts.length) {
    tasks.push(request('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        name: 'Основной счёт',
        bank: 'FinanceManager',
        type: 'debit',
        balance: 0,
        currency: 'RUB',
        icon: 'bi-wallet2',
      }),
    }));
  }

  if (!userBankItems.length && Array.isArray(bankCatalog) && bankCatalog.length) {
    bankCatalog.forEach((bank) => {
      tasks.push(request('/userBanks', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          name: bank.name,
          icon: bank.icon,
          color: bank.color,
          connected: false,
          lastSync: null,
          error: false,
        }),
      }));
    });
  }

  if (tasks.length) {
    await Promise.all(tasks);
  }
}

async function getUserData(userId, options = {}) {
  if (options.isDemo || userId === 'demo') {
    return JSON.parse(JSON.stringify({
      accounts: DEMO_DATA.accounts,
      transactions: [...DEMO_DATA.transactions].sort((a, b) => b.date.localeCompare(a.date)),
      budgets: sortBudgetsByLimit(DEMO_DATA.budgets),
      rules: DEMO_DATA.rules,
      banks: DEMO_DATA.banks,
    }));
  }

  await ensureUserSetup(userId);

  const [accountsRaw, transactionsRaw, budgetsRaw, rulesRaw, banksRaw] = await Promise.all([
    request('/accounts'),
    request('/transactions'),
    request('/budgets'),
    request('/rules'),
    request('/userBanks'),
  ]);

  const accounts = byUserId(accountsRaw, userId).map((item) => ({
    ...item,
    balance: Number(item.balance || 0),
    currency: item.currency || 'RUB',
  }));

  const transactions = byUserId(transactionsRaw, userId)
    .map((item) => ({
      ...item,
      amount: Number(item.amount || 0),
      categoryName: item.categoryName || CATEGORIES.find((entry) => entry.value === item.category)?.label || item.category || 'Без категории',
    }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)) || Number(b.id) - Number(a.id));

  const budgets = sortBudgetsByLimit(byUserId(budgetsRaw, userId).map(normalizeBudget));
  const rules = byUserId(rulesRaw, userId).map(normalizeRule);
  const banks = byUserId(banksRaw, userId);

  return { accounts, transactions, budgets, rules, banks };
}

async function createTransaction(payload) {
  const preparedPayload = await applyRulesToTransaction(payload);
  return request('/transactions', { method: 'POST', body: JSON.stringify(preparedPayload) });
}
async function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: 'DELETE' });
}
async function updateAccount(id, payload) {
  return request(`/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}
async function addRule(payload) {
  return request('/rules', { method: 'POST', body: JSON.stringify(payload) });
}
async function deleteRule(id) {
  return request(`/rules/${id}`, { method: 'DELETE' });
}
async function updateBank(id, payload) {
  return request(`/userBanks/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}
async function addBudget(payload) {
  return request('/budgets', { method: 'POST', body: JSON.stringify(payload) });
}
async function updateBudget(id, payload) {
  return request(`/budgets/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}
async function deleteBudget(id) {
  return request(`/budgets/${id}`, { method: 'DELETE' });
}

async function computeSummary(transactions = [], accounts = []) {
  const income = transactions.filter((t) => t.amount > 0).reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((t) => t.amount < 0).reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const exchangeRates = await fetchExchangeRates();
  const totalBalance = accounts.reduce((sum, item) => {
    const currency = String(item.currency || 'RUB').toUpperCase();
    const balance = Number(item.balance || 0);
    if (currency === 'USD') return sum + (balance * Number(exchangeRates.USD || FALLBACK_RATES.USD));
    if (currency === 'EUR') return sum + (balance * Number(exchangeRates.EUR || FALLBACK_RATES.EUR));
    return sum + balance;
  }, 0);
  return { income, expenses, totalBalance, savings: income - expenses, exchangeRates };
}

function groupExpensesByCategory(transactions = []) {
  const map = {};
  transactions.filter((t) => t.amount < 0).forEach((t) => {
    if (!map[t.category]) map[t.category] = { key: t.category, name: t.categoryName, amount: 0 };
    map[t.category].amount += Math.abs(t.amount);
  });
  return Object.values(map).sort((a, b) => b.amount - a.amount);
}

function groupTransactionsByDay(transactions = []) {
  const byDay = {};
  transactions.forEach((t) => {
    if (!byDay[t.date]) byDay[t.date] = { income: 0, expense: 0 };
    if (t.amount > 0) byDay[t.date].income += t.amount;
    else byDay[t.date].expense += Math.abs(t.amount);
  });
  const dates = Object.keys(byDay).sort();
  return {
    labels: dates.map(formatDate),
    income: dates.map((d) => byDay[d].income),
    expenses: dates.map((d) => byDay[d].expense),
  };
}

window.Api = {
  API_URL,
  DEMO_DATA,
  CATEGORIES,
  request,
  pingApi,
  login,
  register,
  getCurrentUser,
  getPageContext,
  getUserData,
  createTransaction,
  deleteTransaction,
  updateAccount,
  addRule,
  deleteRule,
  updateBank,
  addBudget,
  updateBudget,
  deleteBudget,
  computeSummary,
  fetchExchangeRates,
  groupExpensesByCategory,
  groupTransactionsByDay,
  getAuth,
  clearAuth,
  formatCurrency,
  formatDate,
};
