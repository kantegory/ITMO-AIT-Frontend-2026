// тему переключаем атрибутом media у двух файлов: у выбранной "all", у второй "not all"
const THEME_STORAGE_KEY = 'eventtix-theme';

function themeLinks() {
  return {
    light: document.querySelector('link[data-theme="light"]'),
    dark: document.querySelector('link[data-theme="dark"]'),
  };
}

function applyTheme(theme) {
  const links = themeLinks();
  if (!links.light || !links.dark) return;

  if (theme === 'light' || theme === 'dark') {
    links.light.media = theme === 'light' ? 'all' : 'not all';
    links.dark.media = theme === 'dark' ? 'all' : 'not all';
  } else {
    links.light.media = '(prefers-color-scheme: light)';
    links.dark.media = '(prefers-color-scheme: dark)';
  }
}

function currentTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

applyTheme(localStorage.getItem(THEME_STORAGE_KEY));

function renderToggle(button, theme) {
  const isDark = theme === 'dark';
  button.querySelector('.js-theme-icon').textContent = isDark ? '☾' : '☀';
  button.querySelector('.js-theme-text').textContent = isDark ? 'Светлая тема' : 'Тёмная тема';
  button.setAttribute('aria-pressed', String(isDark));
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.js-theme-toggle');
  if (!button) return;

  renderToggle(button, currentTheme());

  button.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
    renderToggle(button, next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      renderToggle(button, currentTheme());
    }
  });
});