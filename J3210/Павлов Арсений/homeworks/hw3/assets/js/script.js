const API_BASE_URL = "http://localhost:3000";
const AUTH_STORAGE_KEY = "lab2-auth-state";
const FILTER_STORAGE_KEY = "lab2-transactions-filters";
const THEME_STORAGE_KEY = "hw3-theme";
const THEMES = ["neon", "paper"];

const PRIVATE_PAGES = new Set(["dashboard", "transactions", "report", "integrations"]);
const GUEST_PAGES = new Set(["login.html", "register.html"]);

const RUB_FORMATTER = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

const TYPE_LABELS = {
  expense: "Расход",
  income: "Доход",
  transfer: "Перевод",
};

const CATEGORY_LABELS = {
  groceries: "Продукты",
  salary: "Доход",
  subscriptions: "Подписки",
  transport: "Транспорт",
  savings: "Накопления",
  food: "Кафе",
  freelance: "Фриланс",
  utilities: "Коммунальные",
  scholarship: "Стипендия",
  gifts: "Подарки",
  housing: "Жилье",
  education: "Образование",
  other: "Прочее",
};

document.addEventListener("DOMContentLoaded", () => {
  void bootstrapApplication();
});

async function bootstrapApplication() {
  initThemeToggle();
  updateCopyrightYear();
  initAccessibilityFeatures();
  bindLogoutButtons();

  const pageKey = document.body.dataset.page || "";
  const pageName = getCurrentPageName();
  const authState = readAuthState();

  if (PRIVATE_PAGES.has(pageKey) && !authState) {
    redirectTo("login.html");
    return;
  }

  if (GUEST_PAGES.has(pageName) && authState) {
    redirectTo("dashboard.html");
    return;
  }

  let session = null;

  if (authState) {
    session = await hydrateSession(authState);

    if (!session) {
      clearAuthState();
      if (PRIVATE_PAGES.has(pageKey)) {
        redirectTo("login.html");
        return;
      }
    }
  }

  if (session) {
    writeUserName(session.user);
  }

  if (PRIVATE_PAGES.has(pageKey) && session) {
    try {
      await ensureStarterData(session);
    } catch (error) {
      showPageAlert(`Не удалось подготовить данные профиля: ${error.message}`);
    }
  }

  if (pageName === "login.html") {
    initLoginForm();
    return;
  }

  if (pageName === "register.html") {
    initRegisterForm();
    return;
  }

  if (!session) {
    return;
  }

  if (pageKey === "dashboard") {
    await initDashboardPage(session);
    return;
  }

  if (pageKey === "transactions") {
    await initTransactionsPage(session);
    return;
  }

  if (pageKey === "report") {
    await initReportPage(session);
    return;
  }

  if (pageKey === "integrations") {
    await initIntegrationsPage(session);
  }
}

function initThemeToggle() {
  const root = document.documentElement;
  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    savedTheme = null;
  }
  const initialTheme = THEMES.includes(savedTheme) ? savedTheme : "neon";
  applyTheme(initialTheme);

  const navList = document.querySelector(".navbar-nav");
  if (!navList) {
    return;
  }

  const item = document.createElement("li");
  item.className = "nav-item ms-lg-2";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-sm btn-outline-secondary theme-toggle-btn";
  button.setAttribute("aria-live", "polite");

  const setButtonText = (theme) => {
    const nextTheme = theme === "neon" ? "paper" : "neon";
    const label = nextTheme === "paper" ? "светлую" : "неоновую";
    button.textContent = `Тема: переключить на ${label}`;
  };

  setButtonText(initialTheme);

  button.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "neon";
    const next = current === "neon" ? "paper" : "neon";
    applyTheme(next);
    setButtonText(next);
  });

  item.append(button);
  navList.append(item);
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Ignore write errors in strict/private browser modes. */
  }
}

function getCurrentPageName() {
  const parts = window.location.pathname.split("/");
  const pageName = parts[parts.length - 1];
  return pageName || "index.html";
}

function redirectTo(page) {
  window.location.href = page;
}

function updateCopyrightYear() {
  const yearNodes = document.querySelectorAll("[data-current-year]");
  const year = String(new Date().getFullYear());
  yearNodes.forEach((node) => {
    node.textContent = year;
  });
}

function initAccessibilityFeatures() {
  const main = document.querySelector("#mainContent");
  const skipLink = document.querySelector(".skip-link");
  if (main && skipLink) {
    skipLink.addEventListener("click", () => {
      main.focus();
    });
  }

  const liveNodes = [
    "#recentTransactionsBody",
    "#transactionsTableBody",
    "#reportChart",
    "#providersGrid",
    "#syncLog",
  ];

  liveNodes.forEach((selector) => {
    const node = document.querySelector(selector);
    if (!node) {
      return;
    }

    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "false");
  });

  const formMessages = document.querySelectorAll("[data-form-message]");
  formMessages.forEach((node) => {
    node.setAttribute("aria-live", "polite");
    node.setAttribute("aria-atomic", "true");
  });
}

function bindLogoutButtons() {
  const buttons = document.querySelectorAll(".js-logout");
  buttons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      clearAuthState();
      redirectTo("login.html");
    });
  });
}

function writeUserName(user) {
  const nodes = document.querySelectorAll("[data-user-name]");
  if (!nodes.length || !user) {
    return;
  }

  const readableName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.email || "пользователь";
  nodes.forEach((node) => {
    node.textContent = readableName;
  });
}

function readAuthState() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAuthState(payload) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* Ignore write errors in strict/private browser modes. */
  }
}

function clearAuthState() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    /* Ignore write errors in strict/private browser modes. */
  }
}

async function hydrateSession(authState) {
  if (!authState?.token) {
    return null;
  }

  const userId = authState.user?.id || decodeUserIdFromToken(authState.token);
  if (!userId) {
    return null;
  }

  try {
    const user = await apiRequest(`/users/${userId}`, { token: authState.token });
    return {
      token: authState.token,
      user,
    };
  } catch (error) {
    if (isForbiddenError(error)) {
      return {
        token: authState.token,
        user: authState.user || { id: userId, email: authState.email || "" },
      };
    }

    return null;
  }
}

function decodeUserIdFromToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) {
      return null;
    }

    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const userId = Number(payload.sub || payload.userId || payload.id);
    return Number.isFinite(userId) ? userId : null;
  } catch {
    return null;
  }
}

function decodeBase64Url(raw) {
  const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  return atob(normalized + padding);
}

async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token,
    headers = {},
  } = options;

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    payload = await response.json();
  } else {
    const text = await response.text();
    payload = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      (Array.isArray(payload?.errors) ? payload.errors.join("; ") : null) ||
      `Ошибка API (${response.status})`;

    const apiError = new Error(String(message));
    apiError.status = response.status;
    throw apiError;
  }

  return payload;
}

function normalizeErrorMessage(error) {
  if (!error?.message) {
    return "Произошла ошибка. Повторите попытку.";
  }

  if (error.message.toLowerCase().includes("failed to fetch")) {
    return "API недоступен. Убедитесь, что json-server запущен на http://localhost:3000.";
  }

  return error.message;
}

function isForbiddenError(error) {
  if (Number(error?.status) === 403) {
    return true;
  }

  return String(error?.message || "").includes("(403)");
}

async function requestOwnedCollection(path, token) {
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

function normalizeLoginErrorMessage(error) {
  const message = normalizeErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes("failed to fetch")) {
    return message;
  }

  const knownLoginFailures = [
    "ошибка api (400)",
    "ошибка api (403)",
    "incorrect password",
    "cannot find user",
    "invalid credentials",
    "bad request",
    "email or password",
    "email and password are required",
  ];

  if (knownLoginFailures.some((token) => lower.includes(token))) {
    return "Неверный email или пароль.";
  }

  return message;
}

function normalizeRegisterErrorMessage(error) {
  const message = normalizeErrorMessage(error);
  const lower = message.toLowerCase();

  if (lower.includes("failed to fetch")) {
    return message;
  }

  if (lower.includes("already exists") || lower.includes("email is already")) {
    return "Пользователь с таким email уже существует.";
  }

  return message;
}

function showFormMessage(form, type, text) {
  const container = form.querySelector("[data-form-message]");
  if (!container) {
    return;
  }

  container.className = type === "success" ? "alert alert-success mt-3" : "alert alert-danger mt-3";
  container.textContent = text;
  container.setAttribute("role", type === "success" ? "status" : "alert");
  container.setAttribute("aria-live", type === "success" ? "polite" : "assertive");
  container.classList.remove("d-none");
}

function showPageAlert(text, type = "danger") {
  const main = document.querySelector("main.container");
  if (!main) {
    return;
  }

  let node = document.querySelector("#pageGlobalAlert");
  if (!node) {
    node = document.createElement("div");
    node.id = "pageGlobalAlert";
    main.prepend(node);
  }

  node.className = `alert alert-${type} mb-4`;
  node.textContent = text;
  node.setAttribute("role", type === "danger" ? "alert" : "status");
  node.setAttribute("aria-live", type === "danger" ? "assertive" : "polite");
}

function clearPageAlert() {
  const node = document.querySelector("#pageGlobalAlert");
  node?.remove();
}

function formatCurrency(value) {
  return RUB_FORMATTER.format(Number(value) || 0);
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toIsoDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function currentMonthKey() {
  return toIsoDate(new Date()).slice(0, 7);
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] || "Прочее";
}

function getTypeLabel(type) {
  return TYPE_LABELS[type] || "Операция";
}

function getBadgeClass(type) {
  if (type === "income") {
    return "badge-soft-income";
  }

  if (type === "transfer") {
    return "badge-soft-transfer";
  }

  return "badge-soft-expense";
}

function escapeHtml(raw) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return String(raw).replace(/[&<>"']/g, (symbol) => map[symbol]);
}

async function ensureStarterData(session) {
  const { token, user } = session;
  const userId = user.id;

  let accounts = await requestOwnedCollection(`/accounts?userId=${userId}`, token);
  if (!accounts.length) {
    const accountSeed = [
      { name: "Карта Alfa", balance: 48900, currency: "RUB", type: "card" },
      { name: "Счет Tinkoff", balance: 122550, currency: "RUB", type: "bank" },
      { name: "Накопительный", balance: 45000, currency: "RUB", type: "savings" },
    ];

    accounts = await Promise.all(
      accountSeed.map((item) =>
        apiRequest("/accounts", {
          method: "POST",
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
    const budgetSeed = [
      { category: "groceries", categoryLabel: "Продукты", limit: 15000, current: 11300 },
      { category: "transport", categoryLabel: "Транспорт", limit: 8000, current: 4980 },
      { category: "subscriptions", categoryLabel: "Подписки", limit: 2500, current: 1520 },
    ];

    await Promise.all(
      budgetSeed.map((item) =>
        apiRequest("/budgets", {
          method: "POST",
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
    const providerSeed = [
      { name: "Tinkoff API", status: "connected", lastSync: toIsoDate(new Date()), login: "demo_user" },
      { name: "Alfa OpenBanking", status: "disconnected", lastSync: null, login: "" },
      { name: "Sber API", status: "disconnected", lastSync: null, login: "" },
      { name: "Qiwi Wallet", status: "disconnected", lastSync: null, login: "" },
    ];

    await Promise.all(
      providerSeed.map((item) =>
        apiRequest("/providers", {
          method: "POST",
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
    const accountCard = accounts.find((item) => item.type === "card") || accounts[0];
    const accountMain = accounts.find((item) => item.type === "bank") || accounts[0];
    const today = new Date();

    const seedTransactions = [
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
        title: "Продукты (Перекресток)",
        category: "groceries",
        type: "expense",
        amount: 3280,
        accountId: accountCard?.id,
        accountName: accountCard?.name || "Карта",
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
        title: "Зарплата за месяц",
        category: "salary",
        type: "income",
        amount: 96300,
        accountId: accountMain?.id,
        accountName: accountMain?.name || "Счет",
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
        title: "Подписка на музыку",
        category: "subscriptions",
        type: "expense",
        amount: 269,
        accountId: accountCard?.id,
        accountName: accountCard?.name || "Карта",
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
        title: "Такси до университета",
        category: "transport",
        type: "expense",
        amount: 540,
        accountId: accountCard?.id,
        accountName: accountCard?.name || "Карта",
      },
      {
        date: toIsoDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5)),
        title: "Фриланс: лендинг",
        category: "freelance",
        type: "income",
        amount: 18000,
        accountId: accountMain?.id,
        accountName: accountMain?.name || "Счет",
      },
    ];

    await Promise.all(
      seedTransactions.map((item) =>
        apiRequest("/transactions", {
          method: "POST",
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

function initLoginForm() {
  const form = document.querySelector("form[data-auth-form='login']");
  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const email = form.querySelector("#email").value.trim();
    const password = form.querySelector("#password").value;

    try {
      const authResponse = await apiRequest("/login", {
        method: "POST",
        body: { email, password },
      });

      const token = authResponse?.accessToken;
      const userId = decodeUserIdFromToken(token || "");

      if (!token || !userId) {
        throw new Error("Сервер не вернул корректный токен авторизации.");
      }

      let user = authResponse?.user;

      if (!user?.id) {
        try {
          user = await apiRequest(`/users/${userId}`, { token });
        } catch (loadUserError) {
          if (isForbiddenError(loadUserError)) {
            user = { id: userId, email };
          } else {
            throw loadUserError;
          }
        }
      }

      const session = { token, user };

      await ensureStarterData(session);
      saveAuthState(session);
      redirectTo("dashboard.html");
    } catch (error) {
      showFormMessage(form, "error", normalizeLoginErrorMessage(error));
    }
  });
}

function initRegisterForm() {
  const form = document.querySelector("form[data-auth-form='register']");
  if (!form) {
    return;
  }

  const confirmField = form.querySelector("#confirmPassword");
  const passwordField = form.querySelector("#password");

  const syncPasswordsValidity = () => {
    if (!confirmField || !passwordField) {
      return;
    }

    const isMatch = confirmField.value.trim() === passwordField.value.trim();
    confirmField.setCustomValidity(isMatch ? "" : "Пароли не совпадают");
  };

  confirmField?.addEventListener("input", syncPasswordsValidity);
  passwordField?.addEventListener("input", syncPasswordsValidity);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    syncPasswordsValidity();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const firstName = form.querySelector("#firstName").value.trim();
    const lastName = form.querySelector("#lastName").value.trim();
    const email = form.querySelector("#email").value.trim();
    const password = form.querySelector("#password").value;

    try {
      const authResponse = await apiRequest("/register", {
        method: "POST",
        body: {
          email,
          password,
          firstName,
          lastName,
        },
      });

      const token = authResponse?.accessToken;
      const userId = decodeUserIdFromToken(token || "");

      if (!token || !userId) {
        throw new Error("Сервер не вернул корректный токен после регистрации.");
      }

      let user = authResponse?.user;

      if (!user?.id) {
        try {
          user = await apiRequest(`/users/${userId}`, { token });
        } catch (loadUserError) {
          if (isForbiddenError(loadUserError)) {
            user = { id: userId, email, firstName, lastName };
          } else {
            throw loadUserError;
          }
        }
      }

      const session = { token, user };

      await ensureStarterData(session);
      saveAuthState(session);
      redirectTo("dashboard.html");
    } catch (error) {
      showFormMessage(form, "error", normalizeRegisterErrorMessage(error));
    }
  });
}

async function initDashboardPage(session) {
  const quickForm = document.querySelector("#quickTransactionForm");
  const accountSelect = document.querySelector("#quickAccount");

  let accountsCache = [];

  const loadDashboardData = async () => {
    clearPageAlert();

    const [accounts, budgets, transactions] = await Promise.all([
      apiRequest(`/accounts?userId=${session.user.id}`, { token: session.token }),
      apiRequest(`/budgets?userId=${session.user.id}`, { token: session.token }),
      apiRequest(`/transactions?userId=${session.user.id}&_sort=date&_order=desc`, { token: session.token }),
    ]);

    accountsCache = accounts;
    renderDashboardStats(accounts, transactions);
    renderAccountsList(accounts);
    renderBudgetsList(budgets);
    renderRecentTransactions(transactions.slice(0, 6));
    fillQuickAccountOptions(accounts);
  };

  try {
    await loadDashboardData();
  } catch (error) {
    showPageAlert(normalizeErrorMessage(error));
  }

  if (!quickForm || !accountSelect) {
    return;
  }

  quickForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!quickForm.checkValidity()) {
      quickForm.classList.add("was-validated");
      return;
    }

    const title = quickForm.querySelector("#quickTitle").value.trim();
    const amount = Number(quickForm.querySelector("#quickAmount").value);
    const category = quickForm.querySelector("#quickCategory").value;
    const accountId = Number(accountSelect.value);
    const account = accountsCache.find((item) => Number(item.id) === accountId);

    if (!account) {
      showPageAlert("Не удалось определить счёт для операции.");
      return;
    }

    try {
      await apiRequest("/transactions", {
        method: "POST",
        token: session.token,
        body: {
          userId: session.user.id,
          date: toIsoDate(new Date()),
          title,
          category,
          categoryLabel: getCategoryLabel(category),
          type: "expense",
          typeLabel: getTypeLabel("expense"),
          accountId: account.id,
          accountName: account.name,
          amount,
        },
      });

      await apiRequest(`/accounts/${account.id}`, {
        method: "PATCH",
        token: session.token,
        body: {
          balance: Number(account.balance) - amount,
        },
      });

      quickForm.reset();
      quickForm.classList.remove("was-validated");

      const modalElement = document.querySelector("#quickTransactionModal");
      const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
      modalInstance?.hide();

      await loadDashboardData();
    } catch (error) {
      showPageAlert(normalizeErrorMessage(error));
    }
  });
}

function renderDashboardStats(accounts, transactions) {
  const month = currentMonthKey();
  const monthlyIncome = transactions
    .filter((item) => item.type === "income" && item.date.startsWith(month))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const monthlyExpense = transactions
    .filter((item) => item.type === "expense" && item.date.startsWith(month))
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const totalBalance = accounts.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  const freeAmount = monthlyIncome - monthlyExpense;

  setText("dashboardBalance", formatCurrency(totalBalance));
  setText("dashboardExpense", formatCurrency(monthlyExpense));
  setText("dashboardIncome", formatCurrency(monthlyIncome));
  setText("dashboardFree", formatCurrency(freeAmount));
}

function renderAccountsList(accounts) {
  const node = document.querySelector("#accountList");
  if (!node) {
    return;
  }

  if (!accounts.length) {
    node.innerHTML = '<li><span>Счета не найдены</span><strong>—</strong></li>';
    return;
  }

  node.innerHTML = accounts
    .map(
      (item) => `
        <li>
          <span>${escapeHtml(item.name)}</span>
          <strong>${formatCurrency(item.balance)}</strong>
        </li>
      `,
    )
    .join("");
}

function renderBudgetsList(budgets) {
  const node = document.querySelector("#budgetsList");
  if (!node) {
    return;
  }

  if (!budgets.length) {
    node.innerHTML = '<p class="text-muted-custom mb-0">Бюджеты пока не заданы.</p>';
    return;
  }

  node.innerHTML = budgets
    .map((item) => {
      const limit = Number(item.limit || 0);
      const current = Number(item.current || 0);
      const percent = limit > 0 ? Math.max(0, Math.min(100, Math.round((current / limit) * 100))) : 0;

      return `
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <span>${escapeHtml(item.categoryLabel || getCategoryLabel(item.category))}</span>
            <span class="text-muted-custom">${formatCurrency(current)} / ${formatCurrency(limit)}</span>
          </div>
          <div class="progress" role="progressbar" aria-label="Прогресс бюджета" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}">
            <div class="progress-bar" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderRecentTransactions(transactions) {
  const body = document.querySelector("#recentTransactionsBody");
  if (!body) {
    return;
  }

  if (!transactions.length) {
    body.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-muted-custom">Нет данных по операциям.</td></tr>';
    return;
  }

  body.innerHTML = transactions
    .map((item) => {
      const sign = item.type === "expense" ? "-" : "";
      return `
        <tr>
          <td data-label="Дата">${formatDate(item.date)}</td>
          <td data-label="Описание">${escapeHtml(item.title)}</td>
          <td data-label="Категория"><span class="badge-soft ${getBadgeClass(item.type)}">${escapeHtml(item.categoryLabel || getCategoryLabel(item.category))}</span></td>
          <td data-label="Сумма" class="text-end">${sign}${formatCurrency(item.amount)}</td>
        </tr>
      `;
    })
    .join("");
}

function fillQuickAccountOptions(accounts) {
  const select = document.querySelector("#quickAccount");
  if (!select) {
    return;
  }

  if (!accounts.length) {
    select.innerHTML = '<option value="" selected disabled>Нет доступных счетов</option>';
    select.disabled = true;
    return;
  }

  select.disabled = false;
  select.innerHTML = accounts
    .map((item, index) => `<option value="${item.id}" ${index === 0 ? "selected" : ""}>${escapeHtml(item.name)}</option>`)
    .join("");
}

async function initTransactionsPage(session) {
  const form = document.querySelector("#transactionFilters");
  const tableBody = document.querySelector("#transactionsTableBody");
  const statsCount = document.querySelector("#statsCount");
  const statsIncome = document.querySelector("#statsIncome");
  const statsExpense = document.querySelector("#statsExpense");
  const resetButton = document.querySelector("#resetFilters");

  if (!form || !tableBody || !statsCount || !statsIncome || !statsExpense || !resetButton) {
    return;
  }

  const fields = {
    query: form.querySelector("#filterQuery"),
    category: form.querySelector("#filterCategory"),
    minAmount: form.querySelector("#filterMinAmount"),
    maxAmount: form.querySelector("#filterMaxAmount"),
    fromDate: form.querySelector("#filterFromDate"),
    toDate: form.querySelector("#filterToDate"),
  };

  let allTransactions = [];

  try {
    allTransactions = await apiRequest(`/transactions?userId=${session.user.id}&_sort=date&_order=desc`, {
      token: session.token,
    });
  } catch (error) {
    showPageAlert(normalizeErrorMessage(error));
    return;
  }

  restoreFilters(fields);
  applyAndRender();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyAndRender();
  });

  form.addEventListener("input", applyAndRender);
  form.addEventListener("change", applyAndRender);

  resetButton.addEventListener("click", () => {
    form.reset();
    saveFilters(fields);
    applyAndRender();
  });

  function applyAndRender() {
    const filtered = allTransactions.filter((item) => {
      const query = fields.query.value.trim().toLowerCase();
      const selectedCategory = fields.category.value;
      const minAmount = Number(fields.minAmount.value) || 0;
      const maxAmount = Number(fields.maxAmount.value) || Number.POSITIVE_INFINITY;
      const fromDate = fields.fromDate.value || "0000-00-00";
      const toDate = fields.toDate.value || "9999-12-31";

      const matchesQuery = !query || String(item.title).toLowerCase().includes(query);
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesAmount = Number(item.amount) >= minAmount && Number(item.amount) <= maxAmount;
      const matchesDate = item.date >= fromDate && item.date <= toDate;

      return matchesQuery && matchesCategory && matchesAmount && matchesDate;
    });

    saveFilters(fields);
    renderTransactionsTable(filtered, tableBody, statsCount, statsIncome, statsExpense);
  }
}

function renderTransactionsTable(data, tableBody, statsCount, statsIncome, statsExpense) {
  if (!data.length) {
    tableBody.innerHTML = '<tr><td colspan="7" class="py-4 text-center text-muted-custom">По выбранным фильтрам ничего не найдено.</td></tr>';
  } else {
    tableBody.innerHTML = data
      .map((item) => {
        const badgeClass = getBadgeClass(item.type);
        const sign = item.type === "expense" ? "-" : "";

        return `
          <tr>
            <td data-label="Дата">${formatDate(item.date)}</td>
            <td data-label="Описание" class="text-clamp">${escapeHtml(item.title)}</td>
            <td data-label="Категория">${escapeHtml(item.categoryLabel || getCategoryLabel(item.category))}</td>
            <td data-label="Тип"><span class="badge-soft ${badgeClass}">${escapeHtml(item.typeLabel || getTypeLabel(item.type))}</span></td>
            <td data-label="Счет">${escapeHtml(item.accountName || "—")}</td>
            <td data-label="Сумма">${sign}${formatCurrency(item.amount)}</td>
            <td data-label="ID">#${item.id}</td>
          </tr>
        `;
      })
      .join("");
  }

  const income = data
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const expense = data
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  statsCount.textContent = String(data.length);
  statsIncome.textContent = formatCurrency(income);
  statsExpense.textContent = formatCurrency(expense);
}

async function initReportPage(session) {
  const periodSelect = document.querySelector("#reportPeriod");
  const spentNode = document.querySelector("#reportSpent");
  const incomeNode = document.querySelector("#reportIncome");
  const forecastNode = document.querySelector("#reportForecast");
  const chartNode = document.querySelector("#reportChart");

  if (!periodSelect || !spentNode || !incomeNode || !forecastNode || !chartNode) {
    return;
  }

  let transactions = [];

  try {
    transactions = await apiRequest(`/transactions?userId=${session.user.id}&_sort=date&_order=desc`, {
      token: session.token,
    });
  } catch (error) {
    showPageAlert(normalizeErrorMessage(error));
    return;
  }

  const periodKeys = collectPeriodKeys(transactions);
  fillPeriodSelect(periodSelect, periodKeys);

  const render = (periodKey) => {
    const monthTransactions = transactions.filter((item) => item.date.startsWith(periodKey));

    const spent = monthTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const income = monthTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const forecast = calculateForecast(periodKey, spent);

    spentNode.textContent = formatCurrency(spent);
    incomeNode.textContent = formatCurrency(income);
    forecastNode.textContent = formatCurrency(forecast);

    const categories = aggregateExpenseCategories(monthTransactions);
    renderReportChart(chartNode, categories);
  };

  render(periodSelect.value);
  periodSelect.addEventListener("change", () => render(periodSelect.value));
}

function collectPeriodKeys(transactions) {
  const keys = new Set(transactions.map((item) => item.date.slice(0, 7)));
  if (!keys.size) {
    keys.add(currentMonthKey());
  }

  return Array.from(keys).sort((left, right) => (left > right ? -1 : 1));
}

function fillPeriodSelect(select, periodKeys) {
  select.innerHTML = periodKeys
    .map((key) => `<option value="${key}">${formatMonthLabel(key)}</option>`)
    .join("");
}

function formatMonthLabel(periodKey) {
  const date = new Date(`${periodKey}-01T00:00:00`);
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function calculateForecast(periodKey, spent) {
  const [yearRaw, monthRaw] = periodKey.split("-");
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const daysInMonth = new Date(year, month, 0).getDate();

  const current = new Date();
  const isCurrentPeriod = current.getFullYear() === year && current.getMonth() + 1 === month;
  const elapsedDays = isCurrentPeriod ? current.getDate() : daysInMonth;

  if (!elapsedDays) {
    return spent;
  }

  return Math.round((spent / elapsedDays) * daysInMonth);
}

function aggregateExpenseCategories(transactions) {
  const bucket = new Map();

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      const label = item.categoryLabel || getCategoryLabel(item.category);
      const amount = Number(item.amount || 0);
      bucket.set(label, (bucket.get(label) || 0) + amount);
    });

  const categories = Array.from(bucket.entries())
    .map(([key, value]) => ({ key, value }))
    .sort((left, right) => right.value - left.value);

  if (!categories.length) {
    return [{ key: "Нет расходов", value: 0 }];
  }

  return categories;
}

function renderReportChart(node, categories) {
  const maxValue = Math.max(...categories.map((item) => item.value), 1);

  node.innerHTML = categories
    .map((item) => {
      const width = Math.max(8, Math.round((item.value / maxValue) * 100));
      return `
        <div class="report-bar-row">
          <span>${escapeHtml(item.key)}</span>
          <div class="report-bar-wrap" role="img" aria-label="${escapeHtml(item.key)}: ${item.value}">
            <span class="report-bar" style="width: ${width}%"></span>
          </div>
          <span class="report-value">${formatCurrency(item.value)}</span>
        </div>
      `;
    })
    .join("");
}

async function initIntegrationsPage(session) {
  const providersGrid = document.querySelector("#providersGrid");
  const syncLog = document.querySelector("#syncLog");
  const form = document.querySelector("#connectProviderForm");
  const connectButton = document.querySelector("#connectNewProvider");

  if (!providersGrid || !syncLog || !form || !connectButton) {
    return;
  }

  const providerIdInput = form.querySelector("#providerId");
  const providerNameInput = form.querySelector("#providerName");
  const providerLoginInput = form.querySelector("#providerLogin");
  const providerTokenInput = form.querySelector("#providerToken");

  let providersCache = [];

  const loadProviders = async () => {
    providersCache = await apiRequest(`/providers?userId=${session.user.id}&_sort=name&_order=asc`, {
      token: session.token,
    });

    renderProvidersGrid(providersGrid, providersCache);
    renderSyncLog(syncLog, providersCache);
  };

  try {
    await loadProviders();
  } catch (error) {
    showPageAlert(normalizeErrorMessage(error));
    return;
  }

  connectButton.addEventListener("click", () => {
    providerIdInput.value = "";
    providerNameInput.value = "";
    providerLoginInput.value = "";
    providerTokenInput.value = "";
  });

  providersGrid.addEventListener("click", (event) => {
    const button = event.target.closest(".js-connect-btn");
    if (!button) {
      return;
    }

    const providerId = Number(button.dataset.providerId || "0");
    const provider = providersCache.find((item) => Number(item.id) === providerId);
    if (!provider) {
      return;
    }

    providerIdInput.value = String(provider.id);
    providerNameInput.value = provider.name || "";
    providerLoginInput.value = provider.login || "";
    providerTokenInput.value = "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const providerId = Number(providerIdInput.value || "0");
    const name = providerNameInput.value.trim();
    const login = providerLoginInput.value.trim();

    const payload = {
      userId: session.user.id,
      name,
      login,
      status: "connected",
      lastSync: toIsoDate(new Date()),
    };

    try {
      if (providerId) {
        await apiRequest(`/providers/${providerId}`, {
          method: "PATCH",
          token: session.token,
          body: payload,
        });
      } else {
        const existing = providersCache.find((item) => item.name.toLowerCase() === name.toLowerCase());

        if (existing) {
          await apiRequest(`/providers/${existing.id}`, {
            method: "PATCH",
            token: session.token,
            body: payload,
          });
        } else {
          await apiRequest("/providers", {
            method: "POST",
            token: session.token,
            body: payload,
          });
        }
      }

      form.reset();
      form.classList.remove("was-validated");

      const modalElement = document.querySelector("#connectProviderModal");
      const modalInstance = window.bootstrap?.Modal.getInstance(modalElement);
      modalInstance?.hide();

      await loadProviders();
    } catch (error) {
      showPageAlert(normalizeErrorMessage(error));
    }
  });
}

function renderProvidersGrid(node, providers) {
  if (!providers.length) {
    node.innerHTML = '<p class="text-muted-custom mb-0">Провайдеры пока не подключены.</p>';
    return;
  }

  node.innerHTML = providers
    .map((provider) => {
      const isConnected = provider.status === "connected";
      return `
        <article class="integration-card" data-provider-card="${escapeHtml(provider.name)}">
          <h3 class="h6 mb-2">${escapeHtml(provider.name)}</h3>
          <p class="integration-status mb-3">Статус: ${isConnected ? "подключено" : "не подключено"}</p>
          <button
            class="btn btn-sm btn-outline-accent js-connect-btn"
            type="button"
            data-provider-id="${provider.id}"
            data-bs-toggle="modal"
            data-bs-target="#connectProviderModal"
          >
            ${isConnected ? "Управлять" : "Подключить"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderSyncLog(node, providers) {
  const connected = providers
    .filter((item) => item.status === "connected")
    .sort((left, right) => String(right.lastSync || "").localeCompare(String(left.lastSync || "")));

  if (!connected.length) {
    node.innerHTML = '<div class="soft-panel p-3"><small class="text-muted-custom">Подключенных провайдеров пока нет.</small></div>';
    return;
  }

  node.innerHTML = connected
    .map((item) => {
      const syncText = item.lastSync ? formatDate(item.lastSync) : "нет данных";
      return `
        <div class="soft-panel p-3 mb-2">
          <div class="d-flex justify-content-between gap-2">
            <span>${escapeHtml(item.name)}</span>
            <span class="text-muted-custom">${syncText}</span>
          </div>
          <small class="text-muted-custom">Логин: ${escapeHtml(item.login || "не указан")}</small>
        </div>
      `;
    })
    .join("");
}

function setText(id, text) {
  const node = document.querySelector(`#${id}`);
  if (node) {
    node.textContent = text;
  }
}

function saveFilters(fields) {
  const payload = {
    query: fields.query.value,
    category: fields.category.value,
    minAmount: fields.minAmount.value,
    maxAmount: fields.maxAmount.value,
    fromDate: fields.fromDate.value,
    toDate: fields.toDate.value,
  };

  try {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* Ignore write errors in strict/private browser modes. */
  }
}

function restoreFilters(fields) {
  let raw = null;

  try {
    raw = localStorage.getItem(FILTER_STORAGE_KEY);
  } catch {
    return;
  }

  if (!raw) {
    return;
  }

  try {
    const payload = JSON.parse(raw);
    fields.query.value = payload.query || "";
    fields.category.value = payload.category || "";
    fields.minAmount.value = payload.minAmount || "";
    fields.maxAmount.value = payload.maxAmount || "";
    fields.fromDate.value = payload.fromDate || "";
    fields.toDate.value = payload.toDate || "";
  } catch {
    try {
      localStorage.removeItem(FILTER_STORAGE_KEY);
    } catch {
      /* Ignore write errors in strict/private browser modes. */
    }
  }
}
