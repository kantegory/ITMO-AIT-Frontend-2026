export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function setText(selector, value, root = document) {
  const node = $(selector, root);
  if (node) node.textContent = value;
}

export function sumBy(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

export function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

export function formatCurrency(value) {
  return `₽ ${Number(value || 0).toLocaleString("ru-RU")}`;
}

export function formatLongDate(value) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(value) {
  return new Date(value).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

export function formatDate(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date, value) {
  const next = new Date(date);
  next.setDate(next.getDate() + value);
  return next;
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function escapeAttribute(value) {
  return escapeHtml(value);
}

export function renderSpriteIcon(name, className = "", attrs = 'aria-hidden="true" focusable="false"') {
  const classes = ["icon", className].filter(Boolean).join(" ");
  return `<svg class="${escapeAttribute(classes)}" ${attrs}><use href="./assets/icons/sprite.svg#${escapeAttribute(name)}"></use></svg>`;
}

export function sortTransactions(transactions) {
  return [...transactions].sort((left, right) => right.date.localeCompare(left.date));
}

export function filterByCurrentMonth(transactions) {
  const referenceDate = getReferenceDate(transactions);
  const month = referenceDate.getMonth();
  const year = referenceDate.getFullYear();

  return transactions.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}

export function getSpentByCategory(category, transactions) {
  return transactions
    .filter((item) => item.type === "expense" && item.category === category)
    .reduce((total, item) => total + Number(item.amount), 0);
}

export function getTopExpenseCategory(transactions) {
  return getCategoryBreakdown(transactions.filter((item) => item.type === "expense"))[0] || null;
}

export function getBudgetUsagePercent(budgets, transactions) {
  const totalLimit = sumBy(budgets, "limit");
  if (!totalLimit) return 0;

  const totalSpent = budgets.reduce((total, budget) => total + getSpentByCategory(budget.category, transactions), 0);
  return Math.round((totalSpent / totalLimit) * 100);
}

export function getCategoryBreakdown(transactions) {
  const grouped = transactions.reduce((accumulator, item) => {
    const key = item.category || "Без категории";
    accumulator[key] = (accumulator[key] || 0) + Number(item.amount);
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(([name, amount]) => ({ name, amount }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 5);
}

export function getAccountIcon(type) {
  const map = {
    current: "card",
    savings: "piggy-bank",
    cash: "cash",
  };

  return map[type] || "wallet";
}

export function getCategoryMeta(category, type) {
  if (type === "income") {
    return { icon: "income", backgroundClass: "bg-soft-green" };
  }

  const normalized = category.toLowerCase();
  const map = {
    еда: { icon: "basket", backgroundClass: "bg-soft-orange" },
    транспорт: { icon: "train", backgroundClass: "bg-soft-blue" },
    дом: { icon: "house", backgroundClass: "bg-soft-teal" },
    подписки: { icon: "play", backgroundClass: "bg-soft-purple" },
  };

  return map[normalized] || { icon: "receipt", backgroundClass: "bg-soft-purple" };
}

export function formatLastSync(lastSyncAt, status) {
  if (!lastSyncAt) {
    return status === "inactive" ? "Ручной импорт по необходимости" : "Синхронизации пока не было";
  }

  const date = new Date(lastSyncAt);
  const now = new Date();
  const sameDay = formatDate(date) === formatDate(now);
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (sameDay) {
    return `Последняя синхронизация: сегодня в ${time}`;
  }

  return `Последняя синхронизация: ${date.toLocaleDateString("ru-RU")} в ${time}`;
}

export function getReferenceDate(transactions) {
  if (!transactions.length) return new Date();
  return new Date(sortTransactions(transactions)[0].date);
}

export function getLastNDates(referenceDate, days) {
  return Array.from({ length: days }, (_, index) => addDays(referenceDate, -(days - index - 1)));
}

export function getLastNMonths(referenceDate, count) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(referenceDate);
    date.setMonth(referenceDate.getMonth() - (count - index - 1), 1);
    return date;
  });
}

export function filterRange(transactions, referenceDate, days) {
  const end = new Date(referenceDate);
  const start = addDays(end, -(days - 1));

  return transactions.filter((item) => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  });
}

export function groupSpend(transactions, config, referenceDate) {
  if (config.rangeDays === 90) {
    const months = getLastNMonths(referenceDate, 3);
    const labels = months.map((date) => config.labelForDate(date));
    const values = months.map((date) => {
      const key = config.bucketKey(date);
      return transactions
        .filter((item) => config.bucketKey(new Date(item.date)) === key)
        .reduce((total, item) => total + item.amount, 0);
    });

    return { labels, values };
  }

  const dates = getLastNDates(referenceDate, config.rangeDays);
  const labels = dates.map((date) => config.labelForDate(date));
  const values = dates.map((date) => {
    const key = config.bucketKey(date);
    return transactions
      .filter((item) => config.bucketKey(new Date(item.date)) === key)
      .reduce((total, item) => total + item.amount, 0);
  });

  return { labels, values };
}

export function getDaysLeftInMonth(referenceDate) {
  const nextMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
  return Math.max(0, nextMonth.getDate() - referenceDate.getDate());
}
