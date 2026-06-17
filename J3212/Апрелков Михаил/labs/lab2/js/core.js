const API_BASE_URL = "http://localhost:3000";
const CURRENT_USER_KEY = "currentUser";
const THEME_STORAGE_KEY = "tripatropa-theme";
const SPRITE_URL = "images/sprite.svg";

function applyThemeFromStorage() {
  try {
    if (localStorage.getItem(THEME_STORAGE_KEY) === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  } catch (e) {}
}

applyThemeFromStorage();

function setupThemeToggle() {
  document.querySelectorAll("#themeToggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        try {
          localStorage.setItem(THEME_STORAGE_KEY, "light");
        } catch (e) {}
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        try {
          localStorage.setItem(THEME_STORAGE_KEY, "dark");
        } catch (e) {}
      }
    });
  });
}

function iconSprite(name, extraClass) {
  const id = name.indexOf("icon-") === 0 ? name : "icon-" + name;
  const cls = "icon-svg" + (extraClass ? " " + extraClass : "");
  return (
    '<svg class="' +
    cls +
    '" aria-hidden="true" focusable="false"><use href="' +
    SPRITE_URL +
    "#" +
    id +
    '"></use></svg>'
  );
}

function showToast(message) {
  const toastEl = document.getElementById("mainToast");
  if (!toastEl || typeof bootstrap === "undefined") return;
  const body = toastEl.querySelector(".toast-body");
  if (body) body.textContent = message;
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
  toast.show();
}

async function apiRequest(path, options) {
  const response = await fetch(API_BASE_URL + path, options);
  if (!response.ok) {
    throw new Error("API error: " + response.status);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function getSavedRoutesForUser(userId) {
  const uid = Number(userId);
  if (!Number.isFinite(uid)) return [];
  const allSaved = await apiRequest("/savedRoutes");
  return allSaved.filter(function (item) {
    return Number(item.userId) === uid;
  });
}

function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return null;
  }
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

async function loginUser(email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  let users = await apiRequest(
    "/users?email=" +
      encodeURIComponent(normalizedEmail) +
      "&password=" +
      encodeURIComponent(password)
  );
  if (!users.length) {
    const byEmail = await apiRequest("/users?email=" + encodeURIComponent(normalizedEmail));
    users = byEmail.filter((user) => String(user.password) === String(password));
  }
  if (!users.length) return null;
  const user = users[0];
  setCurrentUser(user);
  return user;
}

async function registerUser(name, email, password) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const existing = await apiRequest("/users?email=" + encodeURIComponent(normalizedEmail));
  if (existing.length) {
    throw new Error("Пользователь с таким email уже существует");
  }
  const payload = {
    name,
    email: normalizedEmail,
    password
  };
  return apiRequest("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeAttr(value) {
  return String(value).replaceAll('"', "&quot;");
}
