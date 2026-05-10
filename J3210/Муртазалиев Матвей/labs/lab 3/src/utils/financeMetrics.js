import { formatCurrency } from "./formatters";

export function sumBy(items, key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

export function sortTransactions(transactions) {
  return [...transactions].sort((left, right) => right.date.localeCompare(left.date));
}

export function addDays(date, value) {
  const next = new Date(date);
  next.setDate(next.getDate() + value);
  return next;
}

export function getReferenceDate(transactions) {
  if (!transactions.length) return new Date();
  return new Date(sortTransactions(transactions)[0].date);
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

export function getTopExpenseCategory(transactions) {
  return getCategoryBreakdown(transactions.filter((item) => item.type === "expense"))[0] || null;
}

export function getBudgetUsagePercent(budgets, transactions) {
  const totalLimit = sumBy(budgets, "limit");
  if (!totalLimit) return 0;

  const totalSpent = budgets.reduce((total, budget) => total + getSpentByCategory(budget.category, transactions), 0);
  return Math.round((totalSpent / totalLimit) * 100);
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

  const map = {
    еда: { icon: "basket", backgroundClass: "bg-soft-orange" },
    транспорт: { icon: "train", backgroundClass: "bg-soft-blue" },
    дом: { icon: "house", backgroundClass: "bg-soft-teal" },
    подписки: { icon: "play", backgroundClass: "bg-soft-purple" },
  };

  return map[String(category || "").toLowerCase()] || { icon: "receipt", backgroundClass: "bg-soft-purple" };
}

export function buildDashboardSummary({ user, accounts, budgets, transactions }) {
  const balance = sumBy(accounts, "balance");
  const currentMonthTransactions = filterByCurrentMonth(transactions);
  const spend = currentMonthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);
  const income = currentMonthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);
  const savingsAccount = accounts.find((item) => item.type === "savings");
  const savingsTarget = Number(savingsAccount?.target || 150000);
  const riskCategories = budgets.filter((item) => getSpentByCategory(item.category, transactions) >= Number(item.limit) * 0.9);
  const topCategory = getTopExpenseCategory(transactions);
  const budgetUsagePercent = Math.min(100, getBudgetUsagePercent(budgets, transactions));
  const savings = Number(savingsAccount?.balance || 0);
  const savingsPercent = Math.min(100, Math.round((savings / savingsTarget) * 100));

  return {
    greeting: `Добрый вечер, ${user?.firstName || "Пользователь"}`,
    description: topCategory
      ? `Сейчас больше всего денег уходит на категорию «${topCategory.name}». За месяц расходы составили ${formatCurrency(spend)}.`
      : "После подключения API здесь отображается сводка по данным пользователя.",
    balance,
    balanceStatus: `${income >= spend ? "+" : "−"}${formatCurrency(Math.abs(income - spend))} за месяц`,
    spend,
    spendStatus: `${budgetUsagePercent}% лимита`,
    income,
    savings,
    savingsPercent,
    savingsStatus: `Цель ${savingsPercent}%`,
    riskCount: riskCategories.length,
    riskStatus: riskCategories.length ? "Требуют внимания" : "Все под контролем",
    topCategory,
  };
}

