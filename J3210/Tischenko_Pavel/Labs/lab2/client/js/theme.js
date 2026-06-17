const KEY = "lab2_theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
    ? "dark"
    : "light";
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.setAttribute(
      "aria-label",
      theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"
    );
    btn.dataset.theme = theme;
    const useEl = btn.querySelector("use");
    if (useEl) {
      useEl.setAttribute(
        "href",
        theme === "dark" ? "assets/sprite.svg#icon-sun" : "assets/sprite.svg#icon-moon"
      );
    }
  }
}

export function initTheme() {
  applyTheme(getPreferredTheme());
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });
}

