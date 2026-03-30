import { PROTECTED_PAGES, SESSION_STORAGE_KEY } from "./config.js";

export function loadSession() {
  try {
    const value = localStorage.getItem(SESSION_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function saveSession(session) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), "=");
    return JSON.parse(atob(padded));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function isProtectedPage(page = document.body.dataset.page) {
  return PROTECTED_PAGES.has(page);
}

export function redirectToLogin() {
  const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
  const target = `./login.html?next=${encodeURIComponent(currentPage)}`;
  window.location.href = target;
}

export function getPostAuthRedirect() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next || "./dashboard.html";
}
