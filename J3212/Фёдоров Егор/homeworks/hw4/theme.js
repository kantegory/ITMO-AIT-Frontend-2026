(function() {
  const STORAGE_KEY = 'mh_theme';

  const ICON_MOON = '<svg class="icon icon-md" aria-hidden="true"><use href="icons.svg#icon-moon"/></svg>';
  const ICON_SUN  = '<svg class="icon icon-md" aria-hidden="true"><use href="icons.svg#icon-sun"/></svg>';

  function getPreferred() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const isDark = theme === 'dark';
      btn.innerHTML = isDark
        ? `${ICON_SUN} <span>Светлая</span>`
        : `${ICON_MOON} <span>Тёмная</span>`;
      btn.setAttribute('aria-label', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');
      btn.setAttribute('aria-pressed', String(isDark));
    });
  }

  function toggleTheme() {
    const current = localStorage.getItem(STORAGE_KEY) ||
      (document.documentElement.classList.contains('dark-theme') ? 'dark' : 'light');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // Apply immediately to prevent flash
  applyTheme(getPreferred());

  window.themeManager = { toggle: toggleTheme, apply: applyTheme };

  document.addEventListener('DOMContentLoaded', () => {
    const current = getPreferred();
    updateToggleButtons(current);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
