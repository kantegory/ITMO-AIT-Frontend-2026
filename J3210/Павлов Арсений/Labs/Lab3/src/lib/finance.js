export const TYPE_LABELS = {
  expense: 'Расход',
  income: 'Доход',
  transfer: 'Перевод',
};

export const CATEGORY_LABELS = {
  groceries: 'Продукты',
  salary: 'Доход',
  subscriptions: 'Подписки',
  transport: 'Транспорт',
  savings: 'Накопления',
  food: 'Кафе',
  freelance: 'Фриланс',
  utilities: 'Коммунальные',
  scholarship: 'Стипендия',
  gifts: 'Подарки',
  housing: 'Жилье',
  education: 'Образование',
  other: 'Прочее',
};

const RUB_FORMATTER = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return RUB_FORMATTER.format(Number(value) || 0);
}

export function formatDate(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function toIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

export function currentMonthKey() {
  return toIsoDate(new Date()).slice(0, 7);
}

export function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || 'Прочее';
}

export function getTypeLabel(type) {
  return TYPE_LABELS[type] || 'Операция';
}

export function getBadgeClass(type) {
  if (type === 'income') {
    return 'badge-soft-income';
  }

  if (type === 'transfer') {
    return 'badge-soft-transfer';
  }

  return 'badge-soft-expense';
}

export function collectPeriodKeys(transactions) {
  const keys = new Set((transactions || []).map((item) => String(item.date || '').slice(0, 7)));
  keys.delete('');

  if (!keys.size) {
    keys.add(currentMonthKey());
  }

  return Array.from(keys).sort((left, right) => (left > right ? -1 : 1));
}

export function formatMonthLabel(periodKey) {
  const date = new Date(`${periodKey}-01T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return periodKey;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function calculateForecast(periodKey, spent) {
  const [yearRaw, monthRaw] = String(periodKey || '').split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    return Number(spent) || 0;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const current = new Date();
  const isCurrent = current.getFullYear() === year && current.getMonth() + 1 === month;
  const elapsedDays = isCurrent ? current.getDate() : daysInMonth;

  if (!elapsedDays) {
    return Number(spent) || 0;
  }

  return Math.round(((Number(spent) || 0) / elapsedDays) * daysInMonth);
}

export function aggregateExpenseCategories(transactions) {
  const bucket = new Map();

  (transactions || [])
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      const label = item.categoryLabel || getCategoryLabel(item.category);
      const amount = Number(item.amount || 0);
      bucket.set(label, (bucket.get(label) || 0) + amount);
    });

  const categories = Array.from(bucket.entries())
    .map(([key, value]) => ({ key, value }))
    .sort((left, right) => right.value - left.value);

  return categories.length ? categories : [{ key: 'Нет расходов', value: 0 }];
}
