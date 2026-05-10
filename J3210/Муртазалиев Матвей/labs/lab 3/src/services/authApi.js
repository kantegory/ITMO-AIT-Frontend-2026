import { apiRequest } from "./api";
import { decodeJwt } from "./sessionStorage";
import {
  createDefaultAccounts,
  createDefaultBudgets,
  createDefaultIntegrations,
  createDefaultRules,
  createDefaultTransactions,
} from "./defaultData";

export async function loginWithCredentials(credentials) {
  const response = await apiRequest("/login", {
    method: "POST",
    auth: false,
    body: credentials,
  });

  return buildSession(response.accessToken, response.user);
}

export async function registerWithProfile(profile) {
  const response = await apiRequest("/register", {
    method: "POST",
    auth: false,
    body: profile,
  });
  const session = await buildSession(response.accessToken, response.user);

  await seedUserData(session.user, profile.plan);
  return session;
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

async function seedUserData(user, plan = "Starter") {
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

