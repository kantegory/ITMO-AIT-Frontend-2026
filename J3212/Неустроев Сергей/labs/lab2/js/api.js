// ЛР2 — обёртка над fetch для работы с мок-API (json-server)
// Базовый адрес API (json-server-auth по умолчанию слушает 3000 порт)
const API_URL = 'http://localhost:3000';

// Возвращает заголовки с токеном авторизации (если пользователь вошёл)
function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Универсальный запрос
async function request(path, { method = 'GET', body, auth = true } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? authHeaders() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  // у DELETE тело может быть пустым
  return res.status === 204 ? null : res.json();
}

// --- Готовые методы под сущности приложения ---
export const api = {
  // транзакции (поддерживает фильтры json-server: ?categoryId=&type=&q=&_sort=&_order=)
  getTransactions: (query = '') => request(`/transactions${query}`),
  addTransaction: (tx) => request('/transactions', { method: 'POST', body: tx }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: 'DELETE' }),

  getAccounts: () => request('/accounts'),
  getCategories: () => request('/categories', { auth: false }),
  getBudgets: () => request('/budgets'),
};

export { API_URL, request };

// TODO: при желании заменить fetch на axios (npm i axios) — логика та же.
