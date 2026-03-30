import { apiRequest } from "./api.js";
import { decodeJwt, loadSession, redirectToLogin, saveSession } from "./session.js";

export async function loginWithCredentials(credentials) {
  const response = await apiRequest("/login", {
    method: "POST",
    auth: false,
    body: credentials,
  });
  const session = await buildSession(response.accessToken, response.user);
  saveSession(session);
  return session;
}

export async function ensureSession() {
  const session = loadSession();
  if (!session?.accessToken) {
    redirectToLogin();
    throw new Error("Требуется авторизация.");
  }

  if (session.user?.id) return session;

  const refreshed = await buildSession(session.accessToken, session.user);
  saveSession(refreshed);
  return refreshed;
}

export async function buildSession(accessToken, fallbackUser = {}) {
  const payload = decodeJwt(accessToken);
  const userId = Number(fallbackUser?.id || payload?.sub || 0);

  if (!userId) {
    throw new Error("Не удалось определить пользователя по токену.");
  }

  const userFromApi = await apiRequest(`/users/${userId}`, {
    token: accessToken,
  });

  return {
    accessToken,
    user: {
      id: userFromApi.id,
      email: userFromApi.email,
      firstName: userFromApi.firstName || fallbackUser.firstName || "Пользователь",
      lastName: userFromApi.lastName || fallbackUser.lastName || "",
      plan: userFromApi.plan || fallbackUser.plan || "Starter",
    },
  };
}

export async function getCollection(resource, userId) {
  const query = new URLSearchParams({ userId: String(userId) });

  if (resource === "transactions") {
    query.set("_sort", "date");
    query.set("_order", "desc");
  }

  return apiRequest(`/${resource}?${query.toString()}`);
}

export async function seedUserData(user, plan = "Starter") {
  const [accounts, budgets, transactions, integrations, rules] = await Promise.all([
    getCollection("accounts", user.id),
    getCollection("budgets", user.id),
    getCollection("transactions", user.id),
    getCollection("integrations", user.id),
    getCollection("rules", user.id),
  ]);

  const tasks = [];

  if (!accounts.length) {
    createDefaultAccounts(user.id, plan).forEach((item) => {
      tasks.push(apiRequest("/accounts", { method: "POST", body: item }));
    });
  }

  if (!budgets.length) {
    createDefaultBudgets(user.id).forEach((item) => {
      tasks.push(apiRequest("/budgets", { method: "POST", body: item }));
    });
  }

  if (!transactions.length) {
    createDefaultTransactions(user.id).forEach((item) => {
      tasks.push(apiRequest("/transactions", { method: "POST", body: item }));
    });
  }

  if (!integrations.length) {
    createDefaultIntegrations(user.id, plan).forEach((item) => {
      tasks.push(apiRequest("/integrations", { method: "POST", body: item }));
    });
  }

  if (!rules.length) {
    createDefaultRules(user.id).forEach((item) => {
      tasks.push(apiRequest("/rules", { method: "POST", body: item }));
    });
  }

  await Promise.all(tasks);
}

function createDefaultAccounts(userId, plan) {
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

function createDefaultBudgets(userId) {
  return [
    { userId, category: "Еда", limit: 25000 },
    { userId, category: "Дом", limit: 24000 },
    { userId, category: "Подписки", limit: 3500 },
    { userId, category: "Транспорт", limit: 9000 },
  ];
}

function createDefaultTransactions(userId) {
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

function createDefaultIntegrations(userId, plan) {
  return [
    { userId, provider: "Тинькофф", status: "active", lastSyncAt: "2026-03-30T18:40:00" },
    { userId, provider: "Сбер", status: "warning", lastSyncAt: "2026-03-08T21:10:00" },
    { userId, provider: plan === "Pro" ? "Альфа-Банк" : "ЮMoney", status: "inactive", lastSyncAt: "" },
  ];
}

function createDefaultRules(userId) {
  return [
    { userId, keyword: "Spotify", category: "Подписки", accountName: "Все счета", notify: true },
    { userId, keyword: "Yandex Taxi", category: "Транспорт", accountName: "Текущий счёт", notify: false },
    { userId, keyword: "Perekrestok", category: "Еда", accountName: "Все счета", notify: true },
  ];
}
