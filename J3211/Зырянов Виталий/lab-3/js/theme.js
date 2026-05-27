(function () {
  const STORAGE_KEY = "ai-hub-theme";
  const LIGHT = "light";
  const DARK = "dark";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === LIGHT || saved === DARK ? saved : null;
  }

  function getSystemTheme() {
    return mediaQuery.matches ? DARK : LIGHT;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateButton(theme);
  }

  function nextTheme(theme) {
    return theme === DARK ? LIGHT : DARK;
  }

  function buttonMeta(theme) {
    if (theme === DARK) {
      return "☀️";
    }
    return "🌙";
  }

  function updateButton(theme) {
    const button = document.getElementById("themeToggle");
    if (!button) return;
  
    const icon = buttonMeta(theme);
    button.textContent = icon;
  }

  function createToggleButton(initialTheme) {
    const navList = document.querySelector(".top-nav .navbar .navbar-nav");
    if (!navList || document.getElementById("themeToggle")) return;

    const item = document.createElement("li");
    item.className = "nav-item";

    const button = document.createElement("button");
    button.id = "themeToggle";
    button.type = "button";
    button.className = "btn btn-sm btn-outline-secondary theme-toggle-btn";

    button.addEventListener("click", function () {
      const currentTheme = document.documentElement.getAttribute("data-theme") || LIGHT;
      const newTheme = nextTheme(currentTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      setTheme(newTheme);
    });

    item.appendChild(button);
    navList.appendChild(item);
    updateButton(initialTheme);
  }

  const initialTheme = getSavedTheme() || getSystemTheme();
  setTheme(initialTheme);

  document.addEventListener("DOMContentLoaded", function () {
    createToggleButton(initialTheme);
  });

  mediaQuery.addEventListener("change", function () {
    if (getSavedTheme()) return;
    setTheme(getSystemTheme());
  });
})();
