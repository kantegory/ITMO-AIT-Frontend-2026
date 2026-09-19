const THEME_STORAGE_KEY = "travelTheme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeButtons(theme) {
  const isDark = theme === "dark";

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const label = button.querySelector("[data-theme-label]");

    if (label) {
      label.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    }

    button.setAttribute("aria-label", isDark ? "Включить светлую тему" : "Включить тёмную тему");
    button.setAttribute("aria-pressed", String(isDark));
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  updateThemeButtons(theme);
}

applyTheme(getPreferredTheme());

document.addEventListener("DOMContentLoaded", () => {
  updateThemeButtons(document.documentElement.dataset.theme);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  });
});
