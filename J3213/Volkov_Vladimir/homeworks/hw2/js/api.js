const API_BASE = 'http://localhost:3000';
const SESSION_KEY = 'moneyflow_user';

function formatMoney(value) {
  return `₽ ${Number(value || 0).toLocaleString('ru-RU')}`;
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(SESSION_KEY);
}

function requireAuth() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = 'login.html';
    return null;
  }

  return user;
}

async function apiRequest(path, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  const response = await fetch(`${API_BASE}${path}`, config);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Ошибка запроса ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

function sameUserId(recordUserId, currentUserId) {
  return String(recordUserId) === String(currentUserId);
}

async function ensureUserFinancialData(userId) {
  const [allAccounts, allBudgets] = await Promise.all([
    apiRequest('/accounts'),
    apiRequest('/budgets')
  ]);

  const userAccounts = allAccounts.filter((item) => sameUserId(item.userId, userId));
  const userBudgets = allBudgets.filter((item) => sameUserId(item.userId, userId));

  const hasMain = userAccounts.some((item) => item.kind === 'main');
  const hasSavings = userAccounts.some((item) => item.kind === 'savings');

  if (!hasMain) {
    await apiRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        kind: 'main',
        title: 'Основной счёт',
        balance: 15000,
        number: 'Карта • **** 4591'
      })
    });
  }

  if (!hasSavings) {
    await apiRequest('/accounts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        kind: 'savings',
        title: 'Сбережения',
        balance: 5000,
        number: 'Накопительный счёт'
      })
    });
  }

  if (!userBudgets.length) {
    const defaultBudgets = [
      { userId, category: 'Продукты', spent: 18500, limit: 22000, color: 'bg-success' },
      { userId, category: 'Развлечения', spent: 9200, limit: 10000, color: 'bg-warning' },
      { userId, category: 'Транспорт', spent: 5800, limit: 8000, color: 'bg-primary' }
    ];

    await Promise.all(
      defaultBudgets.map((budget) =>
        apiRequest('/budgets', {
          method: 'POST',
          body: JSON.stringify(budget)
        })
      )
    );
  }
}