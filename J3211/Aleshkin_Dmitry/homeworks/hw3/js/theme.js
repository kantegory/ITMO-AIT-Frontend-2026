const THEME_STORAGE_KEY = 'financeManagerTheme';
const THEME_VALUES = ['system', 'light', 'dark'];

function getStoredThemePreference() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'system';
}

function resolveTheme(preference) {
  if (preference === 'light' || preference === 'dark') return preference;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getThemeMeta(preference) {
  const resolved = resolveTheme(preference);
  const labels = {
    system: 'Тема: системная',
    light: 'Тема: светлая',
    dark: 'Тема: тёмная'
  };k: 'bi-moon-stars-fill'
  return {
    preference,
    resolved,
    label: labels[preference]
  };
}

function applyTheme(preference = getStoredThemePreference(), { persist = false } = {}) {
  const meta = getThemeMeta(preference);
  document.documentElement.dataset.theme = meta.resolved;
  document.documentElement.dataset.themePreference = meta.preference;
  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, meta.preference);
  }
  window.dispatchEvent(new CustomEvent('themechange', { detail: meta }));
  return meta;
}

function renderThemeButton(button, meta) {
  button.type = 'button';
  button.classList.add('theme-toggle');
  button.setAttribute('aria-label', `${meta.label}. Нажмите, чтобы переключить тему.`);
  button.setAttribute('title', `${meta.label}. Нажмите, чтобы переключить тему.`);
  button.innerHTML = `<i class="bi ${meta.icon}" aria-hidden="true"></i><span>${meta.label}</span>`;
}

function initThemeControls() {
  const buttons = document.querySelectorAll('[data-theme-toggle]');
  if (!buttons.length) return;

  let meta = applyTheme(getStoredThemePreference());
  buttons.forEach((button) => {
    renderThemeButton(button, meta);
    button.addEventListener('click', () => {
      const current = getStoredThemePreference();
      const currentIndex = THEME_VALUES.indexOf(current);
      const next = THEME_VALUES[(currentIndex + 1) % THEME_VALUES.length];
      meta = applyTheme(next, { persist: true });
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => renderThemeButton(btn, meta));
    });
  });
}

const systemThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
if (typeof systemThemeMedia.addEventListener === 'function') {
  systemThemeMedia.addEventListener('change', () => {
    if (getStoredThemePreference() === 'system') {
      applyTheme('system');
      document.querySelectorAll('[data-theme-toggle]').forEach((btn) => renderThemeButton(btn, getThemeMeta('system')));
    }
  });
}

document.addEventListener('DOMContentLoaded', initThemeControls);
window.ThemeManager = { applyTheme, getStoredThemePreference, resolveTheme };
