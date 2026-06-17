const STORAGE_USERS_KEY = "eventpass_users";
const STORAGE_CURRENT_USER_KEY = "eventpass_current_user";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function loadUsers() {
  return readJSON(STORAGE_USERS_KEY, []);
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function getCurrentUserId() {
  return localStorage.getItem(STORAGE_CURRENT_USER_KEY);
}

function setCurrentUserId(userId) {
  localStorage.setItem(STORAGE_CURRENT_USER_KEY, userId);
}

function clearCurrentUserId() {
  localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
}

function getCurrentUser() {
  const userId = getCurrentUserId();
  if (!userId) return null;

  const users = loadUsers();
  return users.find((user) => user.id === userId) || null;
}

function getCabinetUrlForUser(user) {
  return user && user.accountType === "organizer" ? "organizer.html" : "profile.html";
}

function updateStoredUser(updatedUser) {
  const users = loadUsers();
  const nextUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
  saveUsers(nextUsers);
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
