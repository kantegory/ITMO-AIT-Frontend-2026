(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const API_BASE = "http://localhost:3000";
  const spritePath = "assets/img/icons-sprite.svg";
  const roleKey = "lab1Role";
  const tokenKey = "lab1Token";
  const userKey = "lab1User";
  const themeKey = "lab1Theme";
  const flashKey = "lab1Flash";
  const systemThemeQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  const formatDate = (value = new Date()) =>
    new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(value);

  const saveToken = (token) => {
    try {
      sessionStorage.setItem(tokenKey, token);
    } catch {
      return;
    }
  };

  const getToken = () => {
    try {
      return sessionStorage.getItem(tokenKey) || "";
    } catch {
      return "";
    }
  };

  const saveUser = (user) => {
    try {
      sessionStorage.setItem(userKey, JSON.stringify(user));
    } catch {
      return;
    }
  };

  const getSavedUser = () => {
    try {
      const raw = sessionStorage.getItem(userKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const getSavedRole = () => {
    try {
      return sessionStorage.getItem(roleKey) || "";
    } catch {
      return "";
    }
  };

  const saveRole = (role) => {
    try {
      sessionStorage.setItem(roleKey, role);
    } catch {
      return;
    }
  };

  const clearRole = () => {
    try {
      sessionStorage.removeItem(roleKey);
    } catch {
      return;
    }
  };

  const clearAuth = () => {
    clearRole();
    try {
      sessionStorage.removeItem(tokenKey);
      sessionStorage.removeItem(userKey);
    } catch {
      return;
    }
  };

  const setFlash = (message) => {
    try {
      sessionStorage.setItem(flashKey, message);
    } catch {
      return;
    }
  };

  const consumeFlash = () => {
    try {
      const message = sessionStorage.getItem(flashKey) || "";
      sessionStorage.removeItem(flashKey);
      return message;
    } catch {
      return "";
    }
  };

  const redirectToLogin = (message) => {
    if (message) setFlash(message);
    window.location.replace("index.html");
  };

  const requireRole = (expectedRole) => {
    const savedRole = getSavedRole();
    const savedUser = getSavedUser();
    const token = getToken();

    if (!expectedRole) return true;
    if (!token || !savedUser || savedRole !== expectedRole) {
      clearAuth();
      redirectToLogin("Сначала войдите в кабинет с подходящей ролью.");
      return false;
    }

    return true;
  };

  const getCurrentUser = () => getSavedUser();

  const getCurrentTenantProfile = () => {
    const user = getCurrentUser();
    return {
      userId: user?.id || null,
      tenant: user?.name || "Арендатор",
      space: user?.room || "3.18",
    };
  };

  const api = async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return response.json();
    }

    return null;
  };

  const fetchCollection = (resource, query = "") => api(`/${resource}${query}`);
  const createResource = (resource, payload) =>
    api(`/${resource}`, { method: "POST", body: JSON.stringify(payload) });
  const updateResource = (resource, id, payload) =>
    api(`/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

  const loginUser = async (email, password) => {
    const users = await fetchCollection(
      "users",
      `?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    );

    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Неверный логин или пароль.");
    }

    const user = users[0];
    saveRole(user.role);
    saveUser(user);
    saveToken(btoa(`${user.id}:${Date.now()}`));
    return user;
  };

  const registerUser = async (userData) => {
    const users = await fetchCollection("users", `?email=${encodeURIComponent(userData.email)}`);
    if (Array.isArray(users) && users.length > 0) {
      throw new Error("Пользователь с таким email уже существует.");
    }

    const createdUser = await createResource("users", userData);
    saveRole(createdUser.role);
    saveUser(createdUser);
    saveToken(btoa(`${createdUser.id}:${Date.now()}`));
    return createdUser;
  };

  const getModal = (id) => {
    const element = document.getElementById(id);
    return window.bootstrap && element ? window.bootstrap.Modal.getOrCreateInstance(element) : null;
  };

  let announcementTimer = 0;

  const announce = (message) => {
    const pageAnnouncements = $("#pageAnnouncements");
    if (!pageAnnouncements || !message) return;

    if (announcementTimer) {
      window.clearTimeout(announcementTimer);
    }

    pageAnnouncements.textContent = "";
    announcementTimer = window.setTimeout(() => {
      pageAnnouncements.textContent = message;
    }, 50);
  };

  const showToast = (message) => {
    if (!message) return;

    announce(message);

    const toast = $("#actionToast");
    const toastMessage = $("#actionToastMessage");
    if (!toast || !toastMessage || !window.bootstrap) return;

    toastMessage.textContent = message;
    window.bootstrap.Toast.getOrCreateInstance(toast).show();
  };

  const getSavedTheme = () => {
    try {
      const theme = localStorage.getItem(themeKey);
      return theme === "dark" || theme === "light" ? theme : "";
    } catch {
      return "";
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(themeKey, theme);
    } catch {
      return;
    }
  };

  const getSystemTheme = () => (systemThemeQuery?.matches ? "dark" : "light");

  const icon = (name, label = "") =>
    `<svg class="ui-icon" aria-hidden="${label ? "false" : "true"}"${
      label ? ` aria-label="${label}"` : ""
    }><use href="${spritePath}#${name}"></use></svg>`;

  const updateThemeToggle = () => {
    const activeTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";

    $$("[data-theme-toggle]").forEach((button) => {
      const label = $("[data-theme-toggle-label]", button);
      if (label) {
        label.textContent = activeTheme === "dark" ? "Тема: тёмная" : "Тема: светлая";
      }

      button.setAttribute(
        "aria-label",
        activeTheme === "dark"
          ? "Переключить на светлую тему"
          : "Переключить на тёмную тему",
      );
      button.setAttribute("aria-pressed", String(activeTheme === "dark"));
      button.dataset.themeValue = activeTheme;
    });
  };

  const applyTheme = (theme) => {
    const resolvedTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.setAttribute("data-bs-theme", resolvedTheme);
    updateThemeToggle();
  };

  const createThemeToggleItem = () => {
    const item = document.createElement("div");
    item.className = "theme-toggle-wrap";
    item.dataset.themeSwitcher = "true";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeToggle = "true";
    button.innerHTML = `${icon("icon-theme")}<span data-theme-toggle-label></span>`;
    button.addEventListener("click", () => {
      const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      saveTheme(nextTheme);
      applyTheme(nextTheme);
      showToast(nextTheme === "dark" ? "Включена тёмная тема." : "Включена светлая тема.");
    });

    item.append(button);
    return item;
  };

  const mountThemeToggle = () => {
    $$(".footer-note").forEach((footerNote) => {
      if (!$("[data-theme-switcher]", footerNote)) {
        footerNote.append(createThemeToggleItem());
      }
    });

    updateThemeToggle();
  };

  const cabinetLink = (role) => (role === "admin" ? "admin.html" : "tenant.html");
  const roleLabel = (role) => (role === "admin" ? "Администрация" : "Арендатор");

  const linkIcon = (href, label) => {
    if (href === "search.html") return "icon-search";
    if (href === "archive.html") return "icon-archive";
    if (href === "register.html") return "icon-user";
    if (href === "index.html") return "icon-user";
    if (href === "tenant.html" || href === "admin.html") return "icon-user";
    return label === "Уведомления" ? "icon-bell" : "icon-user";
  };

  const pluralize = (value, forms) => {
    const normalized = Math.abs(value) % 100;
    const remainder = normalized % 10;

    if (normalized > 10 && normalized < 20) return forms[2];
    if (remainder > 1 && remainder < 5) return forms[1];
    if (remainder === 1) return forms[0];
    return forms[2];
  };

  const alertFeed = {
    tenant: [
      { date: "20 марта", text: "Напоминание о показаниях." },
      { date: "18 марта", text: "Срок подписи по допсоглашению скоро истекает." },
      { date: "12 марта", text: "Новый счёт и акт уже в архиве.", read: true },
    ],
    admin: [
      { date: "15 марта", text: "Поступили новые показания по помещениям 3.18 и 2.11." },
      { date: "14 марта", text: "Письмо по перепланировке ждёт согласования." },
      { date: "12 марта", text: "Счета за март размещены в кабинетах арендаторов.", read: true },
    ],
  };

  const statusMap = {
    received: { text: "Получено", className: "status-received" },
    review: { text: "На проверке", className: "status-pending" },
    accepted: { text: "Принято", className: "status-accepted" },
    rejected: { text: "Отклонено", className: "status-rejected" },
  };

  const readingStatusMap = {
    pending: {
      tenantText: "Отправлено",
      adminText: "Нужно проверить",
      className: "status-pending",
    },
    accepted: {
      tenantText: "Проверено",
      adminText: "Проверено",
      className: "status-accepted",
    },
    rejected: {
      tenantText: "Отклонено",
      adminText: "Отклонено",
      className: "status-rejected",
    },
  };

  const applicationStatusMap = {
    new: { text: "Новая", className: "status-received" },
    review: { text: "В работе", className: "status-pending" },
    accepted: { text: "Подтверждена", className: "status-accepted" },
    rejected: { text: "Отклонена", className: "status-rejected" },
  };

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const sortByIdDesc = (items = []) =>
    [...items].sort((left, right) => (Number(right.id) || 0) - (Number(left.id) || 0));

  const renderPlaceholderRow = (columns, message) =>
    `<tr><td colspan="${columns}" class="text-body-secondary">${escapeHtml(message)}</td></tr>`;

  const getReadingStatus = (status, mode = "tenant") => {
    const current = readingStatusMap[status] || readingStatusMap.pending;
    return {
      text: mode === "admin" ? current.adminText : current.tenantText,
      className: current.className,
    };
  };

  const belongsToCurrentUser = (item, currentUser = getCurrentUser()) =>
    !currentUser || item.userId === currentUser.id || item.tenant === currentUser.name;

  const bindLogoutLinks = (root = document) => {
    $$("[data-logout]", root).forEach((link) => {
      if (link.dataset.logoutBound === "true") return;
      link.dataset.logoutBound = "true";
      link.addEventListener("click", clearAuth);
    });
  };

  const renderAuthLinks = (items, linkClass) =>
    items
      .map(({ href, label, active, logout, button }) =>
        button
          ? `<li class="nav-item">
              <button class="btn btn-soft notification-trigger" type="button" data-bs-toggle="offcanvas" data-bs-target="#authAlerts" aria-controls="authAlerts">
                ${icon("icon-bell")}
                Уведомления
                <span class="notification-badge-dot" aria-hidden="true"></span>
              </button>
            </li>`
          : `<li class="nav-item"><a class="${linkClass}${active ? " active" : ""}" href="${href}"${
              active ? ' aria-current="page"' : ""
            }${logout ? ' data-logout="true"' : ""}>${icon(linkIcon(href, label))}<span>${label}</span></a></li>`,
      )
      .join("");

  const renderAuthFooterLinks = (items) =>
    items
      .filter(({ button }) => !button)
      .map(
        ({ href, label, logout }) =>
          `<li><a href="${href}"${logout ? ' data-logout="true"' : ""}>${icon(linkIcon(href, label))}<span>${label}</span></a></li>`,
      )
      .join("");

  const syncAuthNavigation = () => {
    const nav = $("#authNav");
    const footer = $("#authFooterLinks");
    if (!nav && !footer) return;

    const role = getSavedRole();
    const currentView = document.body.dataset.view || "";
    const alertsTitle = $("#authAlertsLabel");
    const alertsList = $("#authAlertsList");
    const items = role
      ? [
          { href: cabinetLink(role), label: "Кабинет" },
          { href: "archive.html", label: "Архив", active: currentView === "archive" },
          { href: "search.html", label: "Помещения", active: currentView === "search" },
          { href: "index.html", label: "Выход", logout: true },
          { button: true },
        ]
      : [
          { href: "index.html", label: "Вход", active: currentView === "login" },
          { href: "register.html", label: "Регистрация", active: currentView === "register" },
          { href: "search.html", label: "Помещения", active: currentView === "search" },
        ];

    if (nav) nav.innerHTML = renderAuthLinks(items, "nav-link");
    if (footer) footer.innerHTML = renderAuthFooterLinks(items);

    if (alertsTitle) {
      alertsTitle.textContent = role ? `Уведомления: ${roleLabel(role)}` : "Уведомления";
    }

    if (alertsList) {
      alertsList.setAttribute("aria-live", role ? "polite" : "off");
      alertsList.innerHTML = role
        ? (alertFeed[role] || [])
            .map(
              ({ date, text, read }) => `
                <div class="list-group-item">
                  <div class="notification-entry${read ? " is-read" : ""}">
                    <span class="notification-dot" aria-hidden="true"></span>
                    <div>
                      <div class="fw-semibold">${date}</div>
                      <div class="text-body-secondary small">${text}</div>
                    </div>
                  </div>
                </div>`,
            )
            .join("")
        : "";
    }

    bindLogoutLinks();
  };

  const initPasswordToggles = () => {
    $$("[data-password-toggle]").forEach((button) => {
      if (button.dataset.passwordToggleBound === "true") return;

      const input = $(button.dataset.passwordToggle || "");
      if (!input) return;

      button.dataset.passwordToggleBound = "true";
      button.addEventListener("click", () => {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "Скрыть" : "Показать";
        button.setAttribute("aria-pressed", String(isPassword));
        button.setAttribute(
          "aria-label",
          isPassword ? "Скрыть пароль" : "Показать пароль",
        );
      });
    });
  };

  const renderTableData = async ({
    selector,
    columns,
    emptyMessage,
    errorMessage,
    toastMessage = errorMessage,
    fetchItems,
    transformItems = (items) => items,
    renderItem,
    renderEmpty = (message) => renderPlaceholderRow(columns, message),
    onRendered = () => {},
  }) => {
    const tableBody = $(selector);
    if (!tableBody) return [];

    tableBody.setAttribute("aria-busy", "true");

    try {
      const response = await fetchItems();
      const items = transformItems(Array.isArray(response) ? response : []);

      tableBody.innerHTML = items.length ? items.map(renderItem).join("") : renderEmpty(emptyMessage);
      onRendered(items);
      return items;
    } catch (error) {
      console.error(error);
      tableBody.innerHTML = renderPlaceholderRow(columns, errorMessage);
      showToast(toastMessage);
      return [];
    } finally {
      tableBody.setAttribute("aria-busy", "false");
    }
  };

  const watch = (ids, handler) => {
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      ["input", "change"].forEach((eventName) => {
        element.addEventListener(eventName, handler);
      });
    });
  };

  let systemThemeBound = false;

  const handleSystemThemeChange = () => {
    if (getSavedTheme()) return;
    applyTheme(getSystemTheme());
  };

  const initCommonPage = () => {
    if (document.body.dataset.role && !requireRole(document.body.dataset.role)) {
      return;
    }

    $$("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

    bindLogoutLinks();
    syncAuthNavigation();
    applyTheme(getSavedTheme() || getSystemTheme());
    mountThemeToggle();
    initPasswordToggles();

    if (systemThemeQuery && !systemThemeBound) {
      if (typeof systemThemeQuery.addEventListener === "function") {
        systemThemeQuery.addEventListener("change", handleSystemThemeChange);
      } else if (typeof systemThemeQuery.addListener === "function") {
        systemThemeQuery.addListener(handleSystemThemeChange);
      }

      systemThemeBound = true;
    }

    const pendingFlash = consumeFlash();
    if (pendingFlash) {
      showToast(pendingFlash);
    }
  };

  window.Lab1App = {
    $,
    $$,
    api,
    fetchCollection,
    createResource,
    updateResource,
    loginUser,
    registerUser,
    getModal,
    showToast,
    formatDate,
    clearAuth,
    getToken,
    getSavedRole,
    getCurrentUser,
    getCurrentTenantProfile,
    requireRole,
    cabinetLink,
    roleLabel,
    syncAuthNavigation,
    escapeHtml,
    pluralize,
    sortByIdDesc,
    statusMap,
    applicationStatusMap,
    getReadingStatus,
    belongsToCurrentUser,
    renderTableData,
    renderPlaceholderRow,
    watch,
  };

  document.addEventListener("DOMContentLoaded", initCommonPage);
})();
