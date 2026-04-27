export const API_URL = 'http://localhost:3000';

export const EXCHANGE_RATE_CACHE_KEY = 'financeManagerRates';
export const EXCHANGE_RATE_CACHE_TTL_MS = 1000 * 60 * 60 * 6;

export const FALLBACK_RATES = {
  USD: 0.011,
  EUR: 0.010,
};

export const CATEGORIES = [
  { value: 'products', label: 'Продукты' },
  { value: 'transport', label: 'Транспорт' },
  { value: 'entertainment', label: 'Развлечения' },
  { value: 'salary', label: 'Зарплата' },
  { value: 'health', label: 'Здоровье' },
  { value: 'other', label: 'Прочее' },
];

export const DEMO_DATA = {
  user: {
    id: 'demo',
    name: 'Демо-пользователь',
    email: 'demo@finance.local',
    joinedDate: '2024-01-15',
  },
  accounts: [
    { id: '1', name: 'Основной счёт', bank: 'FinanceManager', type: 'debit', balance: 125000, currency: 'RUB' },
    { id: '2', name: 'Накопительный', bank: 'FinanceManager', type: 'savings', balance: 3500, currency: 'USD' },
  ],
  transactions: [
    { id: '1', userId: 'demo', accountId: '1', date: '2026-04-20', description: 'Зарплата', category: 'salary', categoryName: 'Зарплата', amount: 120000, currency: 'RUB', type: 'income' },
    { id: '2', userId: 'demo', accountId: '1', date: '2026-04-21', description: 'Продукты', category: 'products', categoryName: 'Продукты', amount: -4200, currency: 'RUB', type: 'expense' },
    { id: '3', userId: 'demo', accountId: '1', date: '2026-04-22', description: 'Такси', category: 'transport', categoryName: 'Транспорт', amount: -900, currency: 'RUB', type: 'expense' },
  ],
  budgets: [
    { id: '1', userId: 'demo', category: 'products', categoryName: 'Продукты', limit: 15000 },
    { id: '2', userId: 'demo', category: 'transport', categoryName: 'Транспорт', limit: 7000 },
    { id: '3', userId: 'demo', category: 'entertainment', categoryName: 'Развлечения', limit: 5000 },
  ],
  rules: [
    { id: '1', userId: 'demo', field: 'Описание операции', operator: 'содержит', value: 'пятёрочка', actionType: 'category', actionLabel: 'Относить в категорию', categoryId: 'products', categoryName: 'Продукты', active: true },
  ],
  banks: [
    { id: '1', name: 'Сбер', connected: true, lastSync: '2026-04-20 09:30', error: false },
    { id: '2', name: 'Т-Банк', connected: false, lastSync: null, error: false },
  ],
};