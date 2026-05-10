import { formatDate } from "@/utils/formatters";

export function createDefaultAccounts(userId, plan) {
  return [
    {
      userId,
      name: "Текущий счёт",
      type: "current",
      balance: 126400,
      provider: "Тинькофф Black •••• 4582",
      description: "Основная карта",
    },
    {
      userId,
      name: "Накопительный",
      type: "savings",
      balance: plan === "Pro" ? 112000 : 94200,
      target: 150000,
      provider: "Сбер Вклад",
      description: "Копилка на подушку",
    },
    {
      userId,
      name: "Наличные",
      type: "cash",
      balance: 28300,
      provider: "Ручной ввод",
      description: "Небольшие траты офлайн",
    },
  ];
}

export function createDefaultBudgets(userId) {
  return [
    { userId, category: "Еда", limit: 25000 },
    { userId, category: "Дом", limit: 24000 },
    { userId, category: "Подписки", limit: 3500 },
    { userId, category: "Транспорт", limit: 9000 },
  ];
}

export function createDefaultTransactions(userId) {
  return [
    {
      userId,
      title: "Зарплата",
      category: "Доход",
      amount: 120000,
      type: "income",
      accountName: "Текущий счёт",
      provider: "manual",
      date: "2026-03-05",
    },
    {
      userId,
      title: "Пятерочка",
      category: "Еда",
      amount: 1490,
      type: "expense",
      accountName: "Текущий счёт",
      provider: "Тинькофф",
      date: "2026-03-08",
    },
    {
      userId,
      title: "Метро",
      category: "Транспорт",
      amount: 320,
      type: "expense",
      accountName: "Текущий счёт",
      provider: "Тинькофф",
      date: "2026-03-07",
    },
    {
      userId,
      title: "Коммуналка",
      category: "Дом",
      amount: 8400,
      type: "expense",
      accountName: "Текущий счёт",
      provider: "Сбер",
      date: "2026-03-04",
    },
    {
      userId,
      title: "Киношка",
      category: "Подписки",
      amount: 990,
      type: "expense",
      accountName: "Текущий счёт",
      provider: "ЮMoney",
      date: "2026-03-02",
    },
    {
      userId,
      title: "Рестик",
      category: "Еда",
      amount: 2750,
      type: "expense",
      accountName: "Наличные",
      provider: "manual",
      date: "2026-03-01",
    },
  ];
}

export function createDefaultIntegrations(userId, plan) {
  return [
    { userId, provider: "Тинькофф", status: "active", lastSyncAt: "2026-03-30T18:40:00" },
    { userId, provider: "Сбер", status: "warning", lastSyncAt: "2026-03-08T21:10:00" },
    { userId, provider: plan === "Pro" ? "Альфа-Банк" : "ЮMoney", status: "inactive", lastSyncAt: "" },
  ];
}

export function createDefaultRules(userId) {
  return [
    { userId, keyword: "Spotify", category: "Подписки", accountName: "Все счета", notify: true },
    { userId, keyword: "Yandex Taxi", category: "Транспорт", accountName: "Текущий счёт", notify: false },
    { userId, keyword: "Perekrestok", category: "Еда", accountName: "Все счета", notify: true },
  ];
}

export function buildImportedTransactions(userId, provider, period) {
  const today = new Date();
  const firstDate = new Date(today);
  const secondDate = new Date(today);

  if (period.includes("90")) {
    firstDate.setDate(today.getDate() - 21);
    secondDate.setDate(today.getDate() - 8);
  } else if (period.includes("7")) {
    firstDate.setDate(today.getDate() - 4);
    secondDate.setDate(today.getDate() - 1);
  } else {
    firstDate.setDate(today.getDate() - 10);
    secondDate.setDate(today.getDate() - 3);
  }

  return [
    {
      userId,
      title: `${provider} import: супермаркет`,
      category: "Еда",
      amount: 1780,
      type: "expense",
      accountName: "Текущий счёт",
      provider,
      date: formatDate(firstDate),
    },
    {
      userId,
      title: `${provider} import: транспорт`,
      category: "Транспорт",
      amount: 540,
      type: "expense",
      accountName: "Текущий счёт",
      provider,
      date: formatDate(secondDate),
    },
  ];
}

