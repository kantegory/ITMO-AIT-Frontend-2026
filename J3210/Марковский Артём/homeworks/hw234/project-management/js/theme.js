const themeStorageKey = "taskhub-theme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  document.querySelectorAll("#themeToggle").forEach((button) => {
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.textContent = isDark ? "Светлая тема" : "Тёмная тема";
    button.title = isDark ? "Включить светлую тему" : "Включить тёмную тему";
  });
}

function setupThemeToggle() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  document.querySelectorAll("#themeToggle").forEach((button) => {
    if (button.dataset.bound) {
      return;
    }

    button.dataset.bound = "1";
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark"
        ? "light"
        : "dark";

      localStorage.setItem(themeStorageKey, nextTheme);
      applyTheme(nextTheme);
    });
  });
}
