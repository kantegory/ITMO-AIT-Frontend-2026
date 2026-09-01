"use strict";

(() => {
  const storageKey = "t-pulse-theme";
  const root = document.documentElement;
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  function readSavedTheme() {
    try {
      const value = localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The theme still works for the current page when storage is unavailable.
    }
  }

  function getSystemTheme() {
    return systemTheme.matches ? "dark" : "light";
  }

  function updateThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.append(meta);
    }
    meta.content = theme === "dark" ? "#121419" : "#f5f6fa";
  }

  function updateToggle(button) {
    const darkThemeEnabled = root.dataset.theme === "dark";
    const action = darkThemeEnabled ? "Включить светлую тему" : "Включить тёмную тему";
    const icon = button.querySelector("i");

    button.setAttribute("aria-label", action);
    button.setAttribute("title", action);
    button.setAttribute("aria-pressed", String(darkThemeEnabled));
    icon.className = darkThemeEnabled ? "bi bi-sun" : "bi bi-moon-stars";
  }

  function updateToggles() {
    document.querySelectorAll("[data-theme-toggle]").forEach(updateToggle);
  }

  function applyTheme(theme, persist = false) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateThemeColor(theme);
    updateToggles();

    if (persist) saveTheme(theme);
  }

  function createToggle() {
    if (document.querySelector("[data-theme-toggle]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn icon-btn theme-toggle";
    button.dataset.themeToggle = "";
    button.innerHTML = '<i aria-hidden="true" class="bi"></i>';
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });

    const topbarActions = document.querySelector(".topbar-actions");
    if (topbarActions) {
      topbarActions.prepend(button);
    } else {
      button.classList.add("auth-theme-toggle");
      document.body.append(button);
    }

    updateToggle(button);
  }

  applyTheme(readSavedTheme() || getSystemTheme());

  document.addEventListener("DOMContentLoaded", () => {
    createToggle();
    requestAnimationFrame(() => root.classList.add("theme-ready"));
  });

  systemTheme.addEventListener("change", () => {
    if (!readSavedTheme()) applyTheme(getSystemTheme());
  });
})();
