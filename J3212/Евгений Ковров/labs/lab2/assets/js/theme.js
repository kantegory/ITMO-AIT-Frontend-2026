(function (global) {
  const STORAGE_KEY = 'kontramarkaTheme';
  const DEFAULT_THEME = 'classic';
  const THEMES = ['classic', 'neon'];

  function normalizeTheme(theme) {
    return THEMES.includes(theme) ? theme : DEFAULT_THEME;
  }

  function getStoredTheme() {
    try {
      return normalizeTheme(global.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function getCurrentTheme() {
    return normalizeTheme(document.documentElement.getAttribute('data-theme'));
  }

  function applyTheme(theme) {
    const nextTheme = normalizeTheme(theme);
    document.documentElement.setAttribute('data-theme', nextTheme);

    try {
      global.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch (error) {
      // Ignore storage errors and keep current theme in memory.
    }

    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      updateToggleButton(button, nextTheme);
    });

    return nextTheme;
  }

  function toggleTheme() {
    return applyTheme(getCurrentTheme() === 'classic' ? 'neon' : 'classic');
  }

  function updateToggleButton(button, theme) {
    const nextTheme = theme === 'classic' ? 'neon' : 'classic';
    const themeLabel = theme === 'classic' ? 'Classic' : 'Neon';

    button.className = 'btn theme-toggle-btn';
    button.type = 'button';
    button.setAttribute('data-theme-toggle', '');
    button.setAttribute('aria-label', `Переключить тему. Сейчас выбрана тема ${themeLabel}`);
    button.setAttribute('title', `Переключить на ${nextTheme === 'classic' ? 'classic' : 'neon'} тему`);
    button.innerHTML = `
      <svg class="icon" aria-hidden="true">
        <use href="assets/icons/sprite.svg#icon-moon"></use>
      </svg>
      <span class="theme-toggle-btn__label">Тема</span>
      <span class="theme-toggle-btn__value">${themeLabel}</span>
    `;
  }

  function renderThemeSwitchers() {
    document.querySelectorAll('[data-theme-switcher]').forEach((container) => {
      if (container.querySelector('[data-theme-toggle]')) {
        updateToggleButton(container.querySelector('[data-theme-toggle]'), getCurrentTheme());
        return;
      }

      const button = document.createElement('button');
      updateToggleButton(button, getCurrentTheme());
      container.appendChild(button);
    });
  }

  document.addEventListener('click', (event) => {
    const toggleButton = event.target.closest('[data-theme-toggle]');

    if (!toggleButton) {
      return;
    }

    toggleTheme();
  });

  global.KontramarkaTheme = {
    applyTheme,
    getCurrentTheme,
    toggleTheme
  };

  applyTheme(getStoredTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderThemeSwitchers, { once: true });
  } else {
    renderThemeSwitchers();
  }
})(window);
