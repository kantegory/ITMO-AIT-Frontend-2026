import { computed, ref } from 'vue';
import { api } from '../services/api';
import { accountTypes, currencySymbols } from '../constants/finance';
import { useAuth } from './useAuth';

const accounts = ref([]);
const transactions = ref([]);
const budgets = ref([]);
const integrations = ref([]);
const importRules = ref([]);
const imports = ref([]);
const loading = ref(false);
const error = ref('');

const collections = {
  accounts,
  transactions,
  budgets,
  integrations,
  importRules,
  imports
};

function getUserId() {
  return useAuth().currentUser.value?.id;
}

function normalizeAmount(value) {
  return Number(value) || 0;
}

async function loadCollection(name, userId) {
  const { data } = await api.get(`/${name}`, { params: { userId } });
  collections[name].value = Array.isArray(data) ? data : [];
}

export function useFinance() {
  const { currentUser } = useAuth();

  const currency = computed(() => currentUser.value?.currency || 'EUR');
  const currencySymbol = computed(() => currencySymbols[currency.value] || currency.value);

  function formatMoney(value, customCurrency = currency.value) {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: customCurrency,
      maximumFractionDigits: 0
    }).format(normalizeAmount(value));
  }

  function getAccountBalance(account) {
    const relevant = transactions.value.filter((item) => item.accountId === account.id && item.status !== 'cancelled');
    const delta = relevant.reduce((sum, item) => {
      if (['income', 'transfer_in'].includes(item.type)) return sum + normalizeAmount(item.amount);
      if (['expense', 'transfer_out'].includes(item.type)) return sum - normalizeAmount(item.amount);
      return sum;
    }, 0);
    return normalizeAmount(account.initialBalance) + delta;
  }

  const accountsWithBalance = computed(() =>
    accounts.value.map((account) => ({
      ...account,
      typeTitle: accountTypes[account.type] || account.type,
      currentBalance: getAccountBalance(account)
    }))
  );

  const currentMonthTransactions = computed(() => {
    const now = new Date();
    return transactions.value.filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  });

  const metrics = computed(() => {
    const totalBalance = accountsWithBalance.value.reduce((sum, item) => sum + normalizeAmount(item.currentBalance), 0);
    const monthlyIncome = currentMonthTransactions.value
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + normalizeAmount(item.amount), 0);
    const monthlyExpenses = currentMonthTransactions.value
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + normalizeAmount(item.amount), 0);
    const budgetsWithSpent = budgets.value.map((budget) => ({
      ...budget,
      spent: currentMonthTransactions.value
        .filter((item) => item.type === 'expense' && item.category === budget.category)
        .reduce((sum, item) => sum + normalizeAmount(item.amount), 0)
    }));
    const budgetsProgress = budgetsWithSpent.length
      ? Math.round(budgetsWithSpent.reduce((sum, item) => sum + Math.min(100, (item.spent / item.limit) * 100), 0) / budgetsWithSpent.length)
      : 0;

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      budgetsProgress,
      budgets: budgetsWithSpent,
      recentTransactions: [...transactions.value]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6)
    };
  });

  async function syncData() {
    const userId = getUserId();
    if (!userId) return;
    loading.value = true;
    error.value = '';
    try {
      await Promise.all(Object.keys(collections).map((name) => loadCollection(name, userId)));
    } catch (err) {
      error.value = err.message || 'Не удалось загрузить данные';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function addAccount(payload) {
    const { data } = await api.post('/accounts', {
      id: crypto.randomUUID(),
      userId: getUserId(),
      name: payload.name.trim(),
      type: payload.type,
      currency: payload.currency || currency.value,
      initialBalance: normalizeAmount(payload.initialBalance)
    });
    accounts.value.push(data);
    return data;
  }

  async function addTransaction(payload) {
    const { data } = await api.post('/transactions', {
      id: crypto.randomUUID(),
      userId: getUserId(),
      accountId: payload.accountId,
      date: payload.date,
      description: payload.description.trim(),
      category: payload.category,
      amount: normalizeAmount(payload.amount),
      type: payload.type,
      status: payload.status || 'completed'
    });
    transactions.value.push(data);
    return data;
  }

  async function updateTransaction(id, payload) {
    const { data } = await api.patch(`/transactions/${id}`, {
      accountId: payload.accountId,
      date: payload.date,
      description: payload.description.trim(),
      category: payload.category,
      amount: normalizeAmount(payload.amount),
      type: payload.type,
      status: payload.status
    });
    const index = transactions.value.findIndex((item) => item.id === id);
    if (index !== -1) transactions.value[index] = data;
    return data;
  }

  async function deleteTransaction(id) {
    await api.delete(`/transactions/${id}`);
    transactions.value = transactions.value.filter((item) => item.id !== id);
  }

  async function updateBudget(id, limit) {
    const { data } = await api.patch(`/budgets/${id}`, { limit: normalizeAmount(limit) });
    const index = budgets.value.findIndex((item) => item.id === id);
    if (index !== -1) budgets.value[index] = data;
    return data;
  }

  async function toggleIntegration(id, connected) {
    const { data } = await api.patch(`/integrations/${id}`, {
      connected,
      tokenPreview: connected ? '••••••demo' : '',
      lastSync: connected ? new Date().toISOString().slice(0, 16) : ''
    });
    const index = integrations.value.findIndex((item) => item.id === id);
    if (index !== -1) integrations.value[index] = data;
    return data;
  }

  function getTransactionsWithAccount(filters = {}) {
    const accountMap = Object.fromEntries(accounts.value.map((account) => [account.id, account]));
    let items = transactions.value.map((transaction) => ({
      ...transaction,
      accountName: accountMap[transaction.accountId]?.name || 'Без счёта'
    }));

    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter((item) => [item.description, item.category, item.accountName]
        .some((value) => String(value).toLowerCase().includes(search)));
    }
    if (filters.category) items = items.filter((item) => item.category === filters.category);
    if (filters.accountId) items = items.filter((item) => item.accountId === filters.accountId);
    if (filters.type) items = items.filter((item) => item.type === filters.type);

    const sort = filters.sort || 'date_desc';
    items.sort((a, b) => ({
      date_asc: new Date(a.date) - new Date(b.date),
      amount_desc: normalizeAmount(b.amount) - normalizeAmount(a.amount),
      amount_asc: normalizeAmount(a.amount) - normalizeAmount(b.amount),
      alpha_asc: a.description.localeCompare(b.description, 'ru'),
      alpha_desc: b.description.localeCompare(a.description, 'ru'),
      date_desc: new Date(b.date) - new Date(a.date)
    }[sort] ?? new Date(b.date) - new Date(a.date)));

    return items;
  }

  function getReportData(period = 'month') {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    if (period === 'week') start.setDate(now.getDate() - 6);
    if (period === 'month') start.setMonth(now.getMonth() - 1);
    if (period === 'quarter') start.setMonth(now.getMonth() - 3);
    if (period === 'year') start.setFullYear(now.getFullYear() - 1);
    start.setHours(0, 0, 0, 0);

    const inRange = transactions.value.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
    const expenses = inRange.filter((item) => item.type === 'expense');
    const income = inRange.filter((item) => item.type === 'income');
    const totalExpense = expenses.reduce((sum, item) => sum + normalizeAmount(item.amount), 0);
    const totalIncome = income.reduce((sum, item) => sum + normalizeAmount(item.amount), 0);
    const categoryTotals = expenses.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + normalizeAmount(item.amount);
      return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0] || ['—', 0];

    return {
      period,
      totalExpense,
      totalIncome,
      averageCheck: expenses.length ? totalExpense / expenses.length : 0,
      topCategory,
      categoryTotals,
      expenseCount: expenses.length,
      budgetsProgress: budgets.value.map((budget) => ({
        ...budget,
        spent: expenses
          .filter((item) => item.category === budget.category)
          .reduce((sum, item) => sum + normalizeAmount(item.amount), 0)
      }))
    };
  }

  return {
    accounts,
    transactions,
    budgets,
    integrations,
    importRules,
    imports,
    loading,
    error,
    currency,
    currencySymbol,
    accountsWithBalance,
    metrics,
    formatMoney,
    getAccountBalance,
    getTransactionsWithAccount,
    getReportData,
    syncData,
    addAccount,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateBudget,
    toggleIntegration
  };
}
