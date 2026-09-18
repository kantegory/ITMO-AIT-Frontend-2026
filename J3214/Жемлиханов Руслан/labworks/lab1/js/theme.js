(() => {
  const STORAGE_THEME_KEY = 'floworchestrator_theme';

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(STORAGE_THEME_KEY);
    } catch {
      return null;
    }
  };

  const saveTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_THEME_KEY, theme);
    } catch {
      return;
    }
  };

  const getPreferredTheme = () => {
    const saved = getSavedTheme();
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    saveTheme(theme);
  };

  const updateButton = (button, theme) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    button.textContent = nextTheme === 'dark' ? 'Темная тема' : 'Светлая тема';
    button.setAttribute('aria-label', `Переключить на ${nextTheme === 'dark' ? 'темную' : 'светлую'} тему`);
  };

  const createToggleButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-outline-secondary theme-toggle';
    button.id = 'themeToggle';
    button.setAttribute('aria-live', 'polite');
    document.body.appendChild(button);
    return button;
  };

  document.addEventListener('DOMContentLoaded', () => {
    const initialTheme = getPreferredTheme();
    applyTheme(initialTheme);

    const button = createToggleButton();
    updateButton(button, initialTheme);

    button.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      updateButton(button, next);
    });
  });
})();
