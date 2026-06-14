const STORAGE_CURRENT_USER_KEY = "eventpass_current_user";
const STORAGE_CURRENT_USER_SESSION_KEY = "eventpass_current_user_session";
const STORAGE_REMEMBER_ME_KEY = "eventpass_remember_me";
const STORAGE_REMEMBERED_USER_KEY = "eventpass_remembered_user";
const STORAGE_THEME_KEY = "eventpass_theme";
const API_BASE_URL = "http://localhost:3000";

function getCurrentUserId() {
  const localUserId = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (localUserId) {
    return localUserId;
  }

  return sessionStorage.getItem(STORAGE_CURRENT_USER_SESSION_KEY);
}

function isRememberMeEnabled() {
  return (
    localStorage.getItem(STORAGE_REMEMBER_ME_KEY) === "1" ||
    !!localStorage.getItem(STORAGE_CURRENT_USER_KEY)
  );
}

function setCurrentUserId(userId, options) {
  const rememberMe = !!(options && options.rememberMe);
  const normalizedUserId = String(userId);

  if (rememberMe) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, normalizedUserId);
    localStorage.setItem(STORAGE_REMEMBER_ME_KEY, "1");
    sessionStorage.removeItem(STORAGE_CURRENT_USER_SESSION_KEY);
    return;
  }

  sessionStorage.setItem(STORAGE_CURRENT_USER_SESSION_KEY, normalizedUserId);
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  localStorage.removeItem(STORAGE_REMEMBER_ME_KEY);
  localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY);
}

function setRememberedUser(user) {
  try {
    localStorage.setItem(STORAGE_REMEMBERED_USER_KEY, JSON.stringify(sanitizeUser(user)));
  } catch (error) {
    // Ignore serialization/storage errors, login should still work.
  }
}

function getRememberedUser() {
  const raw = localStorage.getItem(STORAGE_REMEMBERED_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return sanitizeUser(JSON.parse(raw));
  } catch (error) {
    localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY);
    return null;
  }
}

function clearCurrentUserId() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  localStorage.removeItem(STORAGE_REMEMBER_ME_KEY);
  localStorage.removeItem(STORAGE_REMEMBERED_USER_KEY);
  sessionStorage.removeItem(STORAGE_CURRENT_USER_SESSION_KEY);
}

async function getCurrentUser() {
  const userId = getCurrentUserId();
  if (!userId) {
    return null;
  }

  try {
    const user = await apiRequest(`/users/${encodeURIComponent(String(userId))}`);
    const safeUser = sanitizeUser(user);

    if (isRememberMeEnabled()) {
      localStorage.setItem(STORAGE_REMEMBER_ME_KEY, "1");
      setRememberedUser(safeUser);
    }

    return safeUser;
  } catch (error) {
    if (error && error.status === 404) {
      clearCurrentUserId();
      return null;
    }

    if (isRememberMeEnabled()) {
      const rememberedUser = getRememberedUser();
      if (rememberedUser && String(rememberedUser.id) === String(userId)) {
        return rememberedUser;
      }
    }

    return null;
  }
}

function getCabinetUrlForUser(user) {
  return user && user.accountType === "organizer" ? "organizer.html" : "profile.html";
}

function sanitizeUser(user) {
  if (!user || typeof user !== "object") {
    return user;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

async function apiRequest(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  let payload = {};

  try {
    payload = await response.json();
  } catch (error) {
    payload = {};
  }

  if (!response.ok) {
    const message = payload && payload.message ? payload.message : "Ошибка запроса к API.";
    const apiError = new Error(message);
    apiError.status = response.status;
    apiError.payload = payload;
    throw apiError;
  }

  return payload;
}

function apiLogin(email, password) {
  return apiRequest("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  }).then((payload) => ({
    ...payload,
    user: sanitizeUser(payload.user),
  }));
}

function apiRegister(payload) {
  return apiRequest("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((response) => ({
    ...response,
    user: sanitizeUser(response.user),
  }));
}

async function persistUserToApi(user) {
  const payload = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    accountType: user.accountType,
    tickets: Array.isArray(user.tickets) ? user.tickets : [],
    refunds: Array.isArray(user.refunds) ? user.refunds : [],
    organizerEvents: Array.isArray(user.organizerEvents) ? user.organizerEvents : [],
  };

  const savedUser = await apiRequest(`/users/${encodeURIComponent(String(user.id))}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const safeUser = sanitizeUser(savedUser);
  if (isRememberMeEnabled()) {
    setRememberedUser(safeUser);
  }

  return safeUser;
}

async function getOrganizerUsersFromApi() {
  const users = await apiRequest("/users?accountType=organizer");
  if (!Array.isArray(users)) {
    return [];
  }

  return users.map((user) => sanitizeUser(user));
}

function generateId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getStoredTheme() {
  const storedTheme = localStorage.getItem(STORAGE_THEME_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return null;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateThemeToggleButton(button, theme) {
  if (!button) {
    return;
  }

  button.textContent = theme === "dark" ? "Темная тема" : "Светлая тема";
  button.title = theme === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему";
  button.setAttribute(
    "aria-label",
    theme === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему"
  );
}

function mountThemeToggleButton(button) {
  const logoutButton = document.getElementById("logoutBtn") || document.getElementById("organizerLogoutBtn");
  if (logoutButton && logoutButton.parentElement) {
    logoutButton.parentElement.insertBefore(button, logoutButton);
    return;
  }

  const guestNavActions = document.getElementById("guestNavActions");
  if (guestNavActions && guestNavActions.parentElement) {
    guestNavActions.parentElement.insertBefore(button, guestNavActions);
    return;
  }

  const userNavActions = document.getElementById("userNavActions");
  if (userNavActions && userNavActions.parentElement) {
    userNavActions.parentElement.insertBefore(button, userNavActions);
    return;
  }

  const navbarCollapse = document.querySelector(".navbar .navbar-collapse");
  if (navbarCollapse) {
    navbarCollapse.appendChild(button);
    return;
  }

  document.body.appendChild(button);
}

function createThemeToggleButton(onToggle) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-sm btn-outline-secondary theme-toggle-btn";
  button.addEventListener("click", onToggle);
  mountThemeToggleButton(button);
  return button;
}

function initTheme() {
  const storedTheme = getStoredTheme();
  let currentTheme = storedTheme || "light";

  applyTheme(currentTheme);

  const toggleButton = createThemeToggleButton(() => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_THEME_KEY, currentTheme);
    applyTheme(currentTheme);
    updateThemeToggleButton(toggleButton, currentTheme);
  });

  updateThemeToggleButton(toggleButton, currentTheme);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
});
