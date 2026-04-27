import { computed, ref } from 'vue';
import { useApi } from './useApi.js';
import {
  CATEGORIES,
  DEMO_DATA,
  EXCHANGE_RATE_CACHE_KEY,
  EXCHANGE_RATE_CACHE_TTL_MS,
  FALLBACK_RATES,
} from '../utils/constants.js';
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from '../services/auth.js';
import {
  formatCurrency,
  formatDate,
  sameId,
  toNumber,
} from '../utils/formatters.js';

const currentUser = ref(null);
const isDemo = ref(true);
const accounts = ref([]);
const transactions = ref([]);
const budgets = ref([]);
const rules = ref([]);
const banks = ref([]);
const exchangeRates = ref({ ...FALLBACK_RATES });
const loading = ref(false);
const error = ref('');

function byUserId(items = [], userId) {
  return items.filter((item) => String(item.userId) === String(userId));
}

function getCategoryName(category) {
  return CATEGORIES.find((entry) => entry.value === category)?.label || category || 'Без категории';
}

function normalizeBudget(item) {
  return {
    ...item,
    limit: Number(item.limit || 0),
    categoryName: item.categoryName || getCategoryName(item.category),
  };
}

function normalizeTransaction(item) {
  return {
    ...item,
    amount: Number(item.amount || 0),
    categoryName: item.categoryName || getCategoryName(item.category),
  };
}

function normalizeRule(item) {
  return {
    ...item,
    field: item.field || 'Описание операции',
    operator: item.operator || 'содержит',
    value: item.value || item.keywords || '',
    actionType: item.actionType || 'category',
    actionLabel: item.actionLabel || 'Относить в категорию',
    categoryName: item.categoryName || getCategoryName(item.categoryId),
  };
}

function sortBudgetsByLimit(items = []) {
  return [...items].sort(
    (a, b) =>
      Number(b.limit || 0) - Number(a.limit || 0) ||
      String(a.categoryName || '').localeCompare(String(b.categoryName || ''), 'ru'),
  );
}

function setDemoData(message = '') {
  if (message) error.value = message;

  currentUser.value = DEMO_DATA.user;
  isDemo.value = true;
  accounts.value = structuredClone(DEMO_DATA.accounts);
  transactions.value = structuredClone(DEMO_DATA.transactions).map(normalizeTransaction);
  budgets.value = sortBudgetsByLimit(structuredClone(DEMO_DATA.budgets).map(normalizeBudget));
  rules.value = structuredClone(DEMO_DATA.rules).map(normalizeRule);
  banks.value = structuredClone(DEMO_DATA.banks);
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

export function useFinanceManager() {
  const { api } = useApi();

  async function pingApi() {
    await api.get('/users', { params: { _limit: 1 } });
  }

  async function fetchExchangeRates() {
    const cachedRaw = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY);

    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);

        if (
          cached.timestamp &&
          Date.now() - cached.timestamp < EXCHANGE_RATE_CACHE_TTL_MS &&
          cached.rates
        ) {
          exchangeRates.value = { ...FALLBACK_RATES, ...cached.rates };
          return exchangeRates.value;
        }
      } catch {}
    }

    try {
      const response = await fetch('https://open.er-api.com/v6/latest/RUB');
      const data = await response.json();

      const usd = data?.rates?.USD
        ? Number((1 / Number(data.rates.USD)).toFixed(2))
        : FALLBACK_RATES.USD;

      const eur = data?.rates?.EUR
        ? Number((1 / Number(data.rates.EUR)).toFixed(2))
        : FALLBACK_RATES.EUR;

      exchangeRates.value = { USD: usd, EUR: eur };

      localStorage.setItem(
        EXCHANGE_RATE_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          rates: exchangeRates.value,
        }),
      );

      return exchangeRates.value;
    } catch {
      exchangeRates.value = { ...FALLBACK_RATES };
      return exchangeRates.value;
    }
  }

  async function login(email, password) {
    await pingApi();

    const normalizedEmail = email.trim().toLowerCase();
    const { data } = await api.get('/users');

    const user = data.find(
      (item) =>
        item.email?.trim().toLowerCase() === normalizedEmail &&
        String(item.password ?? '') === String(password),
    );

    if (!user) {
      throw new Error('Неверный email или пароль');
    }

    setStoredAuth(user);
    currentUser.value = user;
    isDemo.value = false;

    await loadUserData();

    return user;
  }

  async function register(payload) {
    await pingApi();

    const normalizedEmail = payload.email.trim().toLowerCase();

    const [{ data: users }, { data: bankCatalog }] = await Promise.all([
      api.get('/users'),
      api.get('/banks'),
    ]);

    const exists = users.find(
      (item) => item.email?.trim().toLowerCase() === normalizedEmail,
    );

    if (exists) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const { data: user } = await api.post('/users', {
      name: payload.name,
      email: normalizedEmail,
      password: payload.password,
      verified: true,
      joinedDate: new Date().toISOString().slice(0, 10),
    });

    await Promise.all([
      api.post('/accounts', {
        userId: user.id,
        name: 'Основной счёт',
        bank: 'FinanceManager',
        type: 'debit',
        balance: 0,
        currency: 'RUB',
      }),
      api.post('/budgets', {
        userId: user.id,
        category: 'products',
        categoryName: 'Продукты',
        limit: 15000,
      }),
      api.post('/budgets', {
        userId: user.id,
        category: 'transport',
        categoryName: 'Транспорт',
        limit: 7000,
      }),
      api.post('/budgets', {
        userId: user.id,
        category: 'entertainment',
        categoryName: 'Развлечения',
        limit: 5000,
      }),
      ...bankCatalog.map((bank) =>
        api.post('/userBanks', {
          userId: user.id,
          name: bank.name,
          icon: bank.icon,
          color: bank.color,
          connected: false,
          lastSync: null,
          error: false,
        }),
      ),
    ]);

    setStoredAuth(user);
    currentUser.value = user;
    isDemo.value = false;

    await loadUserData();

    return user;
  }

  async function restoreSession() {
    const auth = getStoredAuth();

    if (!auth?.userId) {
      setDemoData();
      return currentUser.value;
    }

    try {
      const { data } = await api.get('/users');
      const user = data.find((item) => String(item.id) === String(auth.userId));

      if (!user) {
        clearStoredAuth();
        setDemoData('Пользователь не найден. Включён демо-режим.');
        return currentUser.value;
      }

      currentUser.value = user;
      isDemo.value = false;
      return user;
    } catch (err) {
      clearStoredAuth();
      setDemoData(err.message || 'API недоступен. Включён демо-режим.');
      return currentUser.value;
    }
  }

  function logout() {
    clearStoredAuth();
    setDemoData();
  }

  async function loadUserData() {
    loading.value = true;
    error.value = '';

    try {
      await fetchExchangeRates();

      const auth = getStoredAuth();

      if (!auth?.userId) {
        setDemoData();
        return;
      }

      await restoreSession();

      if (isDemo.value || currentUser.value?.id === 'demo') {
        setDemoData();
        return;
      }

      const [
        { data: accountList },
        { data: transactionList },
        { data: budgetList },
        { data: ruleList },
        { data: bankList },
      ] = await Promise.all([
        api.get('/accounts'),
        api.get('/transactions'),
        api.get('/budgets'),
        api.get('/rules'),
        api.get('/userBanks'),
      ]);

      accounts.value = byUserId(accountList, currentUser.value.id).map((item) => ({
        ...item,
        balance: Number(item.balance || 0),
        currency: item.currency || 'RUB',
      }));

      transactions.value = byUserId(transactionList, currentUser.value.id)
        .map(normalizeTransaction)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));

      budgets.value = sortBudgetsByLimit(
        byUserId(budgetList, currentUser.value.id).map(normalizeBudget),
      );

      rules.value = byUserId(ruleList, currentUser.value.id).map(normalizeRule);
      banks.value = byUserId(bankList, currentUser.value.id);
    } catch (err) {
      console.error('loadUserData error:', err);
      setDemoData(err.message || 'Ошибка загрузки данных. Включён демо-режим.');
    } finally {
      loading.value = false;
    }
  }

  async function addBudget(payload) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');
    await api.post('/budgets', payload);
    await loadUserData();
  }

  async function updateBudget(id, payload) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');
    await api.patch(`/budgets/${id}`, payload);
    await loadUserData();
  }

  async function deleteBudget(id) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');
    await api.delete(`/budgets/${id}`);
    await loadUserData();
  }

  async function applyRulesToTransaction(payload) {
    const activeRules = rules.value.filter((rule) => rule.active !== false);

    const matchedRule = activeRules.find(
      (rule) =>
        rule.actionType === 'category' &&
        rule.categoryId &&
        isRuleMatched(rule, payload),
    );

    if (!matchedRule) return payload;

    return {
      ...payload,
      category: matchedRule.categoryId,
      categoryName: matchedRule.categoryName,
      importRuleId: matchedRule.id,
      importRuleApplied: true,
    };
  }

  async function createTransaction(payload) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');

    const prepared = await applyRulesToTransaction(payload);

    await api.post('/transactions', prepared);

    const account = accounts.value.find((item) => sameId(item.id, payload.accountId));

    if (account) {
      await api.patch(`/accounts/${account.id}`, {
        balance: toNumber(account.balance) + toNumber(prepared.amount),
      });
    }

    await loadUserData();
  }

  async function deleteTransaction(id) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');

    const transaction = transactions.value.find((item) => sameId(item.id, id));

    await api.delete(`/transactions/${id}`);

    if (transaction) {
      const account = accounts.value.find((item) => sameId(item.id, transaction.accountId));

      if (account) {
        await api.patch(`/accounts/${account.id}`, {
          balance: toNumber(account.balance) - toNumber(transaction.amount),
        });
      }
    }

    await loadUserData();
  }

  async function addRule(payload) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');
    await api.post('/rules', payload);
    await loadUserData();
  }

  async function deleteRule(id) {
    if (isDemo.value) throw new Error('В демо-режиме изменения отключены');
    await api.delete(`/rules/${id}`);
    await loadUserData();
  }

  const summary = computed(() => {
    const income = transactions.value
      .filter((item) => item.amount > 0)
      .reduce((sum, item) => sum + item.amount, 0);

    const expenses = transactions.value
      .filter((item) => item.amount < 0)
      .reduce((sum, item) => sum + Math.abs(item.amount), 0);

    const totalBalance = accounts.value.reduce((sum, item) => {
      const currency = String(item.currency || 'RUB').toUpperCase();
      const balance = Number(item.balance || 0);

      if (currency === 'USD') {
        return sum + balance * Number(exchangeRates.value.USD || FALLBACK_RATES.USD);
      }

      if (currency === 'EUR') {
        return sum + balance * Number(exchangeRates.value.EUR || FALLBACK_RATES.EUR);
      }

      return sum + balance;
    }, 0);

    return {
      income,
      expenses,
      savings: income - expenses,
      totalBalance,
    };
  });

  const expensesByCategory = computed(() => {
    const map = {};

    transactions.value
      .filter((item) => item.amount < 0)
      .forEach((item) => {
        if (!map[item.category]) {
          map[item.category] = {
            key: item.category,
            name: item.categoryName,
            amount: 0,
          };
        }

        map[item.category].amount += Math.abs(item.amount);
      });

    return Object.values(map).sort((a, b) => b.amount - a.amount);
  });

  const flowByDay = computed(() => {
    const map = {};

    transactions.value.forEach((item) => {
      if (!item.date) return;

      if (!map[item.date]) {
        map[item.date] = {
          income: 0,
          expense: 0,
        };
      }

      if (Number(item.amount) > 0) {
        map[item.date].income += Number(item.amount);
      } else {
        map[item.date].expense += Math.abs(Number(item.amount));
      }
    });

    const dates = Object.keys(map).sort();

    return {
      labels: dates.map(formatDate),
      income: dates.map((date) => map[date].income),
      expenses: dates.map((date) => map[date].expense),
    };
  });

  return {
    currentUser,
    isDemo,
    accounts,
    transactions,
    budgets,
    rules,
    banks,
    exchangeRates,
    loading,
    error,
    summary,
    expensesByCategory,
    flowByDay,
    categories: CATEGORIES,
    formatCurrency,
    formatDate,
    login,
    register,
    logout,
    restoreSession,
    loadUserData,
    addBudget,
    updateBudget,
    deleteBudget,
    createTransaction,
    deleteTransaction,
    addRule,
    deleteRule,
  };
}