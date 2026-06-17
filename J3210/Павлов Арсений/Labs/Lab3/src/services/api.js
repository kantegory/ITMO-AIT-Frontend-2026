import axios from 'axios';
import { getCategoryLabel, getTypeLabel, toIsoDate } from '@/lib/finance';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

function extractErrorMessage(payload, fallbackStatus) {
  if (!payload) {
    return fallbackStatus ? `Ошибка API (${fallbackStatus})` : 'Ошибка запроса к API';
  }

  if (typeof payload === 'string') {
    return payload;
  }

  if (Array.isArray(payload.errors)) {
    return payload.errors.join('; ');
  }

  return payload.message || payload.error || (fallbackStatus ? `Ошибка API (${fallbackStatus})` : 'Ошибка запроса к API');
}

function normalizeApiError(error) {
  if (!error?.response) {
    const networkError = new Error('API недоступен. Убедитесь, что json-server работает на http://localhost:3000.');
    networkError.status = 0;
    return networkError;
  }

  const status = error.response.status;
  const message = extractErrorMessage(error.response.data, status);
  const normalized = new Error(String(message));
  normalized.status = status;
  return normalized;
}

export function isForbiddenError(error) {
  if (Number(error?.status) === 403) {
    return true;
  }

  return String(error?.message || '').includes('(403)');
}

export function normalizeErrorMessage(error) {
  if (!error?.message) {
    return 'Произошла ошибка. Повторите попытку.';
  }

  if (String(error.message).toLowerCase().includes('failed to fetch')) {
    return 'API недоступен. Убедитесь, что json-server работает на http://localhost:3000.';
  }

  return error.message;
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    token,
    params,
    headers = {},
  } = options;

  const requestHeaders = {
    ...headers,
  };

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  try {
    const response = await http.request({
      url: path,
      method,
      headers: requestHeaders,
      params,
      data: body,
    });

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function loginRequest(payload) {
  return apiRequest('/login', {
    method: 'POST',
    body: payload,
  });
}

export function registerRequest(payload) {
  return apiRequest('/register', {
    method: 'POST',
    body: payload,
  });
}

export function fetchUserById(userId, token) {
  return apiRequest(`/users/${userId}`, { token });
}

export async function requestOwnedCollection(path, token) {
  try {
    const data = await apiRequest(path, { token });
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isForbiddenError(error)) {
      return [];
    }

    throw error;
  }
}

export async function ensureStarterData(session) {
  const token = session?.token;
  const userId = session?.user?.id;

  if (!token || !userId) {
    return;
  }

  let accounts = await requestOwnedCollection(`/accounts?userId=${userId}`, token);
  if (!accounts.length) {
    const seed = [
      { name: 'Карта Alfa', balance: 48900, currency: 'RUB', type: 'card' },
      { name: 'Счет Tinkoff', balance: 122550, currency: 'RUB', type: 'bank' },
      { name: 'Накопительный', balance: 45000, currency: 'RUB', type: 'savings' },
    ];

    accounts = await Promise.all(
      seed.map((item) =>
        apiRequest('/accounts', {
          method: 'POST',
          token,
          body: {
            ...item,
            userId,
          },
        }),
      ),
    );
  }

  const budgets = await requestOwnedCollection(`/budgets?userId=${userId}`, token);
  if (!budgets.length) {
    const seed = [
      { category: 'groceries', categoryLabel: 'Продукты', limit: 15000, current: 11300 },
      { category: 'transport', categoryLabel: 'Транспорт', limit: 8000, current: 4980 },
      { category: 'subscriptions', categoryLabel: 'Подписки', limit: 2500, current: 1520 },
    ];

    await Promise.all(
      seed.map((item) =>
        apiRequest('/budgets', {
          method: 'POST',
          token,
          body: {
            ...item,
            userId,
          },
        }),
      ),
    );
  }

  const providers = await requestOwnedCollection(`/providers?userId=${userId}`, token);
  if (!providers.length) {
    const seed = [
      { name: 'Tinkoff API', status: 'connected', lastSync: toIsoDate(new Date()), login: 'demo_user' },
      { name: 'Alfa OpenBanking', status: 'disconnected', lastSync: null, login: '' },
      { name: 'Sber API', status: 'disconnected', lastSync: null, login: '' },
      { name: 'Qiwi Wallet', status: 'disconnected', lastSync: null, login: '' },
    ];

    await Promise.all(
      seed.map((item) =>
        apiRequest('/providers', {
          method: 'POST',
          token,
          body: {
            ...item,
            userId,
          },
        }),
      ),
    );
  }

  const transactions = await requestOwnedCollection(`/transactions?userId=${userId}&_limit=1`, token);
  if (!transactions.length) {
    const card = accounts.find((item) => item.type === 'card') || accounts[0];
    const bank = accounts.find((item) => item.type === 'bank') || accounts[0];
    const today = new Date();

    const seed = [
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
        title: 'Продукты (Перекресток)',
        category: 'groceries',
        type: 'expense',
        amount: 3280,
        accountId: card?.id,
        accountName: card?.name || 'Карта',
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
        title: 'Зарплата за месяц',
        category: 'salary',
        type: 'income',
        amount: 96300,
        accountId: bank?.id,
        accountName: bank?.name || 'Счет',
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
        title: 'Подписка на музыку',
        category: 'subscriptions',
        type: 'expense',
        amount: 269,
        accountId: card?.id,
        accountName: card?.name || 'Карта',
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
        title: 'Такси до университета',
        category: 'transport',
        type: 'expense',
        amount: 540,
        accountId: card?.id,
        accountName: card?.name || 'Карта',
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
        title: 'Фриланс: лендинг',
        category: 'freelance',
        type: 'income',
        amount: 18000,
        accountId: bank?.id,
        accountName: bank?.name || 'Счет',
      },
    ];

    await Promise.all(
      seed.map((item) =>
        apiRequest('/transactions', {
          method: 'POST',
          token,
          body: {
            ...item,
            userId,
            categoryLabel: getCategoryLabel(item.category),
            typeLabel: getTypeLabel(item.type),
          },
        }),
      ),
    );
  }
}
